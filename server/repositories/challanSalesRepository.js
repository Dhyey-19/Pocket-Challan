const { db, runAsync } = require("../db");

function getNextChallanNo() {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COALESCE(MAX(challanNo), 0) AS maxChallan FROM challan_sales",
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

async function insertChallanSale(payload) {
  const createdAt = new Date().toISOString();
  await runAsync("BEGIN TRANSACTION");
  try {
    const headerResult = await runAsync(
      "INSERT INTO challan_sales (challanNo, challanDate, partyId, remarks, billNo, vehicleNo, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        payload.challanNo,
        payload.challanDate,
        payload.partyId,
        payload.remarks,
        payload.billNo,
        payload.vehicleNo,
        createdAt
      ]
    );

    for (const item of payload.items) {
      const grossWeight = Number(item.grossWeight || 0);
      const lessWeight = Number(item.lessWeight || 0);
      const pcs = Number(item.pcs || 0);
      const rate = Number(item.rate || 0);
      const netWeight = grossWeight - lessWeight;
      const amount = item.unit === "per_kg" ? netWeight * rate : pcs * rate;

      await runAsync(
        "INSERT INTO challan_sales_items (challanId, itemId, grossWeight, bagsCrate, lessWeight, netWeight, pcs, unit, rate, amount, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          headerResult.lastID,
          item.itemId,
          grossWeight,
          Number(item.bagsCrate || 0),
          lessWeight,
          netWeight,
          pcs,
          item.unit,
          rate,
          amount,
          item.notes || ""
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

function listChallanSales() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT cs.id, cs.challanNo, cs.challanDate, cs.partyId, pm.partyName, cs.remarks, cs.billNo, cs.vehicleNo, COALESCE(SUM(csi.amount), 0) AS totalAmount FROM challan_sales cs JOIN party_master pm ON pm.id = cs.partyId LEFT JOIN challan_sales_items csi ON csi.challanId = cs.id GROUP BY cs.id ORDER BY cs.challanNo ASC",
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

async function updateChallanSale(challanId, payload) {
  await runAsync("BEGIN TRANSACTION");
  try {
    await runAsync(
      "UPDATE challan_sales SET challanNo = ?, challanDate = ?, partyId = ?, remarks = ?, billNo = ?, vehicleNo = ? WHERE id = ?",
      [
        payload.challanNo,
        payload.challanDate,
        payload.partyId,
        payload.remarks,
        payload.billNo,
        payload.vehicleNo,
        challanId
      ]
    );

    await runAsync("DELETE FROM challan_sales_items WHERE challanId = ?", [challanId]);

    for (const item of payload.items) {
      const grossWeight = Number(item.grossWeight || 0);
      const lessWeight = Number(item.lessWeight || 0);
      const pcs = Number(item.pcs || 0);
      const rate = Number(item.rate || 0);
      const netWeight = grossWeight - lessWeight;
      const amount = item.unit === "per_kg" ? netWeight * rate : pcs * rate;

      await runAsync(
        "INSERT INTO challan_sales_items (challanId, itemId, grossWeight, bagsCrate, lessWeight, netWeight, pcs, unit, rate, amount, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          challanId,
          item.itemId,
          grossWeight,
          Number(item.bagsCrate || 0),
          lessWeight,
          netWeight,
          pcs,
          item.unit,
          rate,
          amount,
          item.notes || ""
        ]
      );
    }

    await runAsync("COMMIT");
    return { id: challanId };
  } catch (error) {
    await runAsync("ROLLBACK");
    throw error;
  }
}

async function deleteChallanSale(challanId) {
  await runAsync("BEGIN TRANSACTION");
  try {
    await runAsync("DELETE FROM challan_sales_items WHERE challanId = ?", [challanId]);
    await runAsync("DELETE FROM challan_sales WHERE id = ?", [challanId]);
    await runAsync("COMMIT");
    return true;
  } catch (error) {
    await runAsync("ROLLBACK");
    throw error;
  }
}

function getChallanSalesById(challanId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT cs.id, cs.challanNo, cs.challanDate, cs.partyId, pm.partyName, cs.remarks, cs.billNo, cs.vehicleNo FROM challan_sales cs JOIN party_master pm ON pm.id = cs.partyId WHERE cs.id = ?",
      [challanId],
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

function listChallanSalesItems(challanId) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT csi.id, csi.itemId, im.itemName, csi.grossWeight, csi.bagsCrate, csi.lessWeight, csi.netWeight, csi.pcs, csi.unit, csi.rate, csi.amount, csi.notes FROM challan_sales_items csi JOIN item_master im ON im.id = csi.itemId WHERE csi.challanId = ? ORDER BY csi.id ASC",
      [challanId],
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

function listChallanSalesItemsByPartyAndDate(partyId, startDate, endDate) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT cs.challanNo, cs.challanDate, csi.netWeight, csi.pcs, csi.unit, csi.rate, csi.amount, im.itemName FROM challan_sales cs JOIN challan_sales_items csi ON csi.challanId = cs.id JOIN item_master im ON im.id = csi.itemId WHERE cs.partyId = ? AND cs.challanDate BETWEEN ? AND ? ORDER BY cs.challanDate ASC, cs.challanNo ASC, csi.id ASC",
      [partyId, startDate, endDate],
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

function sumChallanSalesAmountBeforeDate(partyId, beforeDate) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COALESCE(SUM(csi.amount), 0) AS total FROM challan_sales cs JOIN challan_sales_items csi ON csi.challanId = cs.id WHERE cs.partyId = ? AND cs.challanDate < ?",
      [partyId, beforeDate],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(Number(row?.total || 0));
      }
    );
  });
}

module.exports = {
  getNextChallanNo,
  insertChallanSale,
  listChallanSales,
  getChallanSalesById,
  listChallanSalesItems,
  listChallanSalesItemsByPartyAndDate,
  sumChallanSalesAmountBeforeDate,
  updateChallanSale,
  deleteChallanSale
};
