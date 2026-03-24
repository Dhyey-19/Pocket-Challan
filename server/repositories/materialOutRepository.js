const { db, runAsync } = require("../db");

function getNextMaterialOutNo() {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COALESCE(MAX(challanNo), 0) AS maxChallan FROM material_out",
      [],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        const nextChallan = Number(row?.maxChallan || 0) + 1;
        resolve(nextChallan);
      }
    );
  });
}

async function insertMaterialOut(payload) {
  const createdAt = new Date().toISOString();
  await runAsync("BEGIN TRANSACTION");
  try {
    const headerResult = await runAsync(
      "INSERT INTO material_out (challanNo, challanDate, partyId, remarks, vehicleNo, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [
        payload.challanNo,
        payload.challanDate,
        payload.partyId,
        payload.remarks,
        payload.vehicleNo,
        createdAt
      ]
    );

    for (const item of payload.items) {
      const grossWeight = Number(item.grossWeight || 0);
      const lessWeight = Number(item.lessWeight || 0);
      const pcs = Number(item.pcs || 0);
      const netWeight = grossWeight - lessWeight;

      await runAsync(
        "INSERT INTO material_out_items (materialOutId, itemId, grossWeight, bagsCrate, lessWeight, netWeight, pcs, processType, weightBalance, pcsBalance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          headerResult.lastID,
          item.itemId,
          grossWeight,
          Number(item.bagsCrate || 0),
          lessWeight,
          netWeight,
          pcs,
          item.processType || "",
          netWeight,
          pcs
        ]
      );
    }

    await runAsync("COMMIT");
    return { id: headerResult.lastID, createdAt };
  } catch (error) {
    await runAsync("ROLLBACK");
    throw error;
  }
}

function listMaterialOuts() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT mo.id, mo.challanNo, mo.challanDate, mo.partyId, pm.partyName, mo.remarks, mo.vehicleNo FROM material_out mo JOIN party_master pm ON pm.id = mo.partyId ORDER BY mo.challanNo ASC",
      [],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows || []);
      }
    );
  });
}

function getMaterialOutById(materialOutId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT mo.id, mo.challanNo, mo.challanDate, mo.partyId, pm.partyName, mo.remarks, mo.vehicleNo FROM material_out mo JOIN party_master pm ON pm.id = mo.partyId WHERE mo.id = ?",
      [materialOutId],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row || null);
      }
    );
  });
}

function listMaterialOutItems(materialOutId) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT moi.id, moi.itemId, im.itemName, moi.grossWeight, moi.bagsCrate, moi.lessWeight, moi.netWeight, moi.pcs, moi.processType, moi.weightBalance, moi.pcsBalance FROM material_out_items moi JOIN item_master im ON im.id = moi.itemId WHERE moi.materialOutId = ? ORDER BY moi.id ASC",
      [materialOutId],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows || []);
      }
    );
  });
}

function listMaterialOutParties() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT DISTINCT pm.id, pm.partyName FROM material_out mo JOIN party_master pm ON pm.id = mo.partyId ORDER BY pm.partyName ASC",
      [],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows || []);
      }
    );
  });
}

function listMaterialOutItemsMaster(partyId) {
  return new Promise((resolve, reject) => {
    if (Number.isNaN(Number(partyId)) || Number(partyId) <= 0) {
      db.all(
        "SELECT DISTINCT im.id, im.itemName FROM material_out_items moi JOIN item_master im ON im.id = moi.itemId ORDER BY im.itemName ASC",
        [],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows || []);
        }
      );
      return;
    }

    db.all(
      "SELECT DISTINCT im.id, im.itemName FROM material_out mo JOIN material_out_items moi ON moi.materialOutId = mo.id JOIN item_master im ON im.id = moi.itemId WHERE mo.partyId = ? ORDER BY im.itemName ASC",
      [Number(partyId)],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows || []);
      }
    );
  });
}

function listMaterialOutBalancesByItem(itemId, partyId) {
  return new Promise((resolve, reject) => {
    const hasParty = !(Number.isNaN(Number(partyId)) || Number(partyId) <= 0);
    const sql = hasParty
      ? "SELECT moi.id AS materialOutItemId, mo.challanNo, mo.challanDate, mo.id AS materialOutId, moi.weightBalance, moi.pcsBalance FROM material_out_items moi JOIN material_out mo ON mo.id = moi.materialOutId WHERE moi.itemId = ? AND mo.partyId = ? ORDER BY mo.challanNo ASC"
      : "SELECT moi.id AS materialOutItemId, mo.challanNo, mo.challanDate, mo.id AS materialOutId, moi.weightBalance, moi.pcsBalance FROM material_out_items moi JOIN material_out mo ON mo.id = moi.materialOutId WHERE moi.itemId = ? ORDER BY mo.challanNo ASC";
    const params = hasParty ? [itemId, Number(partyId)] : [itemId];

    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows || []);
    });
  });
}

function listMaterialOutstandingByDate(startDate, endDate) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT mo.challanNo, mo.challanDate, pm.partyName, im.itemName, moi.netWeight, moi.pcs, moi.weightBalance, moi.pcsBalance FROM material_out mo JOIN party_master pm ON pm.id = mo.partyId JOIN material_out_items moi ON moi.materialOutId = mo.id JOIN item_master im ON im.id = moi.itemId WHERE mo.challanDate BETWEEN ? AND ? AND (ABS(COALESCE(moi.weightBalance, 0)) > 0.000001 OR ABS(COALESCE(moi.pcsBalance, 0)) > 0.000001) ORDER BY mo.challanDate ASC, mo.challanNo ASC, pm.partyName ASC, im.itemName ASC, moi.id ASC",
      [startDate, endDate],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows || []);
      }
    );
  });
}

function hasMaterialOutConsumption(materialOutId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COUNT(1) AS total FROM material_in_items mii JOIN material_out_items moi ON moi.id = mii.materialOutItemId WHERE moi.materialOutId = ?",
      [materialOutId],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(Number(row?.total || 0) > 0);
      }
    );
  });
}

async function updateMaterialOut(materialOutId, payload) {
  await runAsync("BEGIN TRANSACTION");
  try {
    const hasConsumption = await hasMaterialOutConsumption(materialOutId);
    if (hasConsumption) {
      throw new Error("Material out has material in entries and cannot be edited.");
    }

    await runAsync(
      "UPDATE material_out SET challanNo = ?, challanDate = ?, partyId = ?, remarks = ?, vehicleNo = ? WHERE id = ?",
      [
        payload.challanNo,
        payload.challanDate,
        payload.partyId,
        payload.remarks,
        payload.vehicleNo,
        materialOutId
      ]
    );

    await runAsync("DELETE FROM material_out_items WHERE materialOutId = ?", [materialOutId]);

    for (const item of payload.items) {
      const grossWeight = Number(item.grossWeight || 0);
      const lessWeight = Number(item.lessWeight || 0);
      const pcs = Number(item.pcs || 0);
      const netWeight = grossWeight - lessWeight;

      await runAsync(
        "INSERT INTO material_out_items (materialOutId, itemId, grossWeight, bagsCrate, lessWeight, netWeight, pcs, processType, weightBalance, pcsBalance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          materialOutId,
          item.itemId,
          grossWeight,
          Number(item.bagsCrate || 0),
          lessWeight,
          netWeight,
          pcs,
          item.processType || "",
          netWeight,
          pcs
        ]
      );
    }

    await runAsync("COMMIT");
    return { id: materialOutId };
  } catch (error) {
    await runAsync("ROLLBACK");
    throw error;
  }
}

async function deleteMaterialOut(materialOutId) {
  await runAsync("BEGIN TRANSACTION");
  try {
    const hasConsumption = await hasMaterialOutConsumption(materialOutId);
    if (hasConsumption) {
      throw new Error("Material out has material in entries and cannot be deleted.");
    }

    await runAsync("DELETE FROM material_out_items WHERE materialOutId = ?", [materialOutId]);
    await runAsync("DELETE FROM material_out WHERE id = ?", [materialOutId]);
    await runAsync("COMMIT");
    return true;
  } catch (error) {
    await runAsync("ROLLBACK");
    throw error;
  }
}

module.exports = {
  getNextMaterialOutNo,
  insertMaterialOut,
  listMaterialOuts,
  getMaterialOutById,
  listMaterialOutItems,
  listMaterialOutParties,
  listMaterialOutItemsMaster,
  listMaterialOutBalancesByItem,
  listMaterialOutstandingByDate,
  updateMaterialOut,
  deleteMaterialOut
};
