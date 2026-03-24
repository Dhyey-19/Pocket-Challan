const { db, runAsync } = require("../db");

const round3 = (value) => Math.round(Number(value || 0) * 1000) / 1000;

function getNextMaterialInNo() {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COALESCE(MAX(challanNo), 0) AS maxChallan FROM material_in",
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

async function insertMaterialIn(payload) {
  const createdAt = new Date().toISOString();
  await runAsync("BEGIN TRANSACTION");
  try {
    const headerResult = await runAsync(
      "INSERT INTO material_in (challanNo, challanDate, partyId, remarks, vehicleNo, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [
        payload.challanNo,
        payload.challanDate,
        payload.partyId,
        payload.remarks,
        payload.vehicleNo,
        createdAt
      ]
    );

    const touchedOutItems = new Set();

    for (const item of payload.items) {
      const grossWeight = Number(item.grossWeight || 0);
      const lessWeight = Number(item.lessWeight || 0);
      const pcs = Number(item.pcs || 0);
      const rate = Number(item.rate || 0);
      const netWeight = grossWeight - lessWeight;
      const amount = item.unit === "per_kg" ? netWeight * rate : pcs * rate;
      const materialOutItemId = Number(item.materialOutItemId || 0);

      const balanceRow = await new Promise((resolve, reject) => {
        db.get(
          "SELECT weightBalance, pcsBalance FROM material_out_items WHERE id = ?",
          [materialOutItemId],
          (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(row || null);
          }
        );
      });

      if (!balanceRow) {
        throw new Error("Selected material out item not found.");
      }

      if (round3(balanceRow.weightBalance) < round3(netWeight) || round3(balanceRow.pcsBalance) < round3(pcs)) {
        throw new Error("Insufficient balance for selected challan.");
      }

      await runAsync(
        "INSERT INTO material_in_items (materialInId, itemId, materialInItemName, materialOutItemId, grossWeight, bagsCrate, lessWeight, netWeight, pcs, unit, rate, amount, processType, weightBalance, pcsBalance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          headerResult.lastID,
          item.itemId,
          item.materialInItemName || "",
          materialOutItemId,
          grossWeight,
          Number(item.bagsCrate || 0),
          lessWeight,
          netWeight,
          pcs,
          item.unit,
          rate,
          amount,
          item.processType || "",
          netWeight,
          pcs
        ]
      );

      await runAsync(
        "UPDATE material_out_items SET weightBalance = weightBalance - ?, pcsBalance = pcsBalance - ? WHERE id = ?",
        [netWeight, pcs, materialOutItemId]
      );
      touchedOutItems.add(materialOutItemId);
    }

    for (const outItemId of touchedOutItems) {
      await recalcMaterialOutBalance(outItemId);
    }

    await runAsync("COMMIT");
    return { id: headerResult.lastID, createdAt };
  } catch (error) {
    await runAsync("ROLLBACK");
    throw error;
  }
}

function listMaterialIns() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT mi.id, mi.challanNo, mi.challanDate, mi.partyId, pm.partyName, mi.remarks, mi.vehicleNo FROM material_in mi JOIN party_master pm ON pm.id = mi.partyId ORDER BY mi.challanNo ASC",
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

function getMaterialInById(materialInId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT mi.id, mi.challanNo, mi.challanDate, mi.partyId, pm.partyName, mi.remarks, mi.vehicleNo FROM material_in mi JOIN party_master pm ON pm.id = mi.partyId WHERE mi.id = ?",
      [materialInId],
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

function listMaterialInItems(materialInId) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT mii.id, mii.itemId, mii.materialInItemName, mii.materialOutItemId, mii.materialInItemName AS itemName, mii.grossWeight, mii.bagsCrate, mii.lessWeight, mii.netWeight, mii.pcs, mii.unit, mii.rate, mii.amount, mii.processType FROM material_in_items mii WHERE mii.materialInId = ? ORDER BY mii.id ASC",
      [materialInId],
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

function listMaterialInItemsRaw(materialInId) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT id, materialOutItemId, netWeight, pcs FROM material_in_items WHERE materialInId = ?",
      [materialInId],
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

async function recalcMaterialOutBalance(materialOutItemId) {
  const outId = Number(materialOutItemId || 0);
  if (Number.isNaN(outId) || outId <= 0) {
    return;
  }

  const baseRow = await new Promise((resolve, reject) => {
    db.get(
      "SELECT netWeight, pcs FROM material_out_items WHERE id = ?",
      [outId],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row || null);
      }
    );
  });

  if (!baseRow) {
    return;
  }

  const usedRow = await new Promise((resolve, reject) => {
    db.get(
      "SELECT COALESCE(SUM(netWeight), 0) AS usedWeight, COALESCE(SUM(pcs), 0) AS usedPcs FROM material_in_items WHERE materialOutItemId = ?",
      [outId],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row || { usedWeight: 0, usedPcs: 0 });
      }
    );
  });

  const baseWeight = Number(baseRow.netWeight || 0);
  const basePcs = Number(baseRow.pcs || 0);
  const usedWeight = Number(usedRow.usedWeight || 0);
  const usedPcs = Number(usedRow.usedPcs || 0);

  await runAsync(
    "UPDATE material_out_items SET weightBalance = ?, pcsBalance = ? WHERE id = ?",
    [baseWeight - usedWeight, basePcs - usedPcs, outId]
  );
}

async function updateMaterialIn(materialInId, payload) {
  await runAsync("BEGIN TRANSACTION");
  try {
    const existingItems = await listMaterialInItemsRaw(materialInId);
    const touchedOutItems = new Set();

    for (const row of existingItems) {
      await runAsync(
        "UPDATE material_out_items SET weightBalance = weightBalance + ?, pcsBalance = pcsBalance + ? WHERE id = ?",
        [Number(row.netWeight || 0), Number(row.pcs || 0), row.materialOutItemId]
      );
      touchedOutItems.add(row.materialOutItemId);
    }

    await runAsync("DELETE FROM material_in_items WHERE materialInId = ?", [materialInId]);

    await runAsync(
      "UPDATE material_in SET challanNo = ?, challanDate = ?, partyId = ?, remarks = ?, vehicleNo = ? WHERE id = ?",
      [
        payload.challanNo,
        payload.challanDate,
        payload.partyId,
        payload.remarks,
        payload.vehicleNo,
        materialInId
      ]
    );

    for (const item of payload.items) {
      const grossWeight = Number(item.grossWeight || 0);
      const lessWeight = Number(item.lessWeight || 0);
      const pcs = Number(item.pcs || 0);
      const rate = Number(item.rate || 0);
      const netWeight = grossWeight - lessWeight;
      const amount = item.unit === "per_kg" ? netWeight * rate : pcs * rate;
      const materialOutItemId = Number(item.materialOutItemId || 0);

      const balanceRow = await new Promise((resolve, reject) => {
        db.get(
          "SELECT weightBalance, pcsBalance FROM material_out_items WHERE id = ?",
          [materialOutItemId],
          (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(row || null);
          }
        );
      });

      if (!balanceRow) {
        throw new Error("Selected material out item not found.");
      }

      if (round3(balanceRow.weightBalance) < round3(netWeight) || round3(balanceRow.pcsBalance) < round3(pcs)) {
        throw new Error("Insufficient balance for selected challan.");
      }

      await runAsync(
        "INSERT INTO material_in_items (materialInId, itemId, materialInItemName, materialOutItemId, grossWeight, bagsCrate, lessWeight, netWeight, pcs, unit, rate, amount, processType, weightBalance, pcsBalance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          materialInId,
          item.itemId,
          item.materialInItemName || "",
          materialOutItemId,
          grossWeight,
          Number(item.bagsCrate || 0),
          lessWeight,
          netWeight,
          pcs,
          item.unit,
          rate,
          amount,
          item.processType || "",
          netWeight,
          pcs
        ]
      );

      await runAsync(
        "UPDATE material_out_items SET weightBalance = weightBalance - ?, pcsBalance = pcsBalance - ? WHERE id = ?",
        [netWeight, pcs, materialOutItemId]
      );
      touchedOutItems.add(materialOutItemId);
    }

    for (const outItemId of touchedOutItems) {
      await recalcMaterialOutBalance(outItemId);
    }

    await runAsync("COMMIT");
    return { id: materialInId };
  } catch (error) {
    await runAsync("ROLLBACK");
    throw error;
  }
}

async function deleteMaterialIn(materialInId) {
  await runAsync("BEGIN TRANSACTION");
  try {
    const existingItems = await listMaterialInItemsRaw(materialInId);
    const touchedOutItems = new Set();

    for (const row of existingItems) {
      await runAsync(
        "UPDATE material_out_items SET weightBalance = weightBalance + ?, pcsBalance = pcsBalance + ? WHERE id = ?",
        [Number(row.netWeight || 0), Number(row.pcs || 0), row.materialOutItemId]
      );
      touchedOutItems.add(row.materialOutItemId);
    }

    await runAsync("DELETE FROM material_in_items WHERE materialInId = ?", [materialInId]);
    await runAsync("DELETE FROM material_in WHERE id = ?", [materialInId]);

    for (const outItemId of touchedOutItems) {
      await recalcMaterialOutBalance(outItemId);
    }
    await runAsync("COMMIT");
    return true;
  } catch (error) {
    await runAsync("ROLLBACK");
    throw error;
  }
}

module.exports = {
  getNextMaterialInNo,
  insertMaterialIn,
  listMaterialIns,
  getMaterialInById,
  listMaterialInItems,
  updateMaterialIn,
  deleteMaterialIn
};
