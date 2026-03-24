const { db } = require("../db");

function listMaterialOutByPartyAndDate(partyId, startDate, endDate) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT mo.challanNo, mo.challanDate, im.itemName, moi.netWeight, moi.pcs, moi.processType FROM material_out mo JOIN material_out_items moi ON moi.materialOutId = mo.id JOIN item_master im ON im.id = moi.itemId WHERE mo.partyId = ? AND mo.challanDate BETWEEN ? AND ? ORDER BY mo.challanDate ASC, mo.challanNo ASC, moi.id ASC",
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

function listMaterialInByPartyAndDate(partyId, startDate, endDate) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT mi.challanNo, mi.challanDate, mii.materialInItemName AS itemName, mii.netWeight, mii.pcs, mii.rate, mii.amount, mii.processType FROM material_in mi JOIN material_in_items mii ON mii.materialInId = mi.id WHERE mi.partyId = ? AND mi.challanDate BETWEEN ? AND ? ORDER BY mi.challanDate ASC, mi.challanNo ASC, mii.id ASC",
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

function listMaterialPaymentsByPartyAndDate(partyId, startDate, endDate) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT id, receiptNo, receiptDate, amount, transactionType FROM material_payment WHERE partyId = ? AND receiptDate BETWEEN ? AND ? ORDER BY receiptDate ASC, receiptNo ASC",
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

module.exports = {
  listMaterialOutByPartyAndDate,
  listMaterialInByPartyAndDate,
  listMaterialPaymentsByPartyAndDate
};
