const { db } = require("../db");

function getNextMaterialReceiptNo() {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COALESCE(MAX(receiptNo), 0) AS maxReceipt FROM material_payment",
      [],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        const nextReceipt = Number(row?.maxReceipt || 0) + 1;
        resolve(nextReceipt);
      }
    );
  });
}

function insertMaterialPayment(payload) {
  return new Promise((resolve, reject) => {
    const createdAt = new Date().toISOString();
    db.run(
      "INSERT INTO material_payment (receiptNo, receiptDate, partyId, amount, transactionType, remarks, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        payload.receiptNo,
        payload.receiptDate,
        payload.partyId,
        payload.amount,
        payload.transactionType,
        payload.remarks,
        createdAt
      ],
      function onInsert(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID, createdAt, ...payload });
      }
    );
  });
}

function listMaterialPayments() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT mp.id, mp.receiptNo, mp.receiptDate, mp.partyId, pm.partyName, mp.amount, mp.transactionType, mp.remarks FROM material_payment mp JOIN party_master pm ON pm.id = mp.partyId ORDER BY mp.receiptNo ASC",
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

function getMaterialPaymentById(paymentId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT mp.id, mp.receiptNo, mp.receiptDate, mp.partyId, pm.partyName, mp.amount, mp.transactionType, mp.remarks FROM material_payment mp JOIN party_master pm ON pm.id = mp.partyId WHERE mp.id = ?",
      [paymentId],
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

function updateMaterialPayment(paymentId, payload) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE material_payment SET receiptNo = ?, receiptDate = ?, partyId = ?, amount = ?, transactionType = ?, remarks = ? WHERE id = ?",
      [
        payload.receiptNo,
        payload.receiptDate,
        payload.partyId,
        payload.amount,
        payload.transactionType,
        payload.remarks,
        paymentId
      ],
      function onUpdate(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes);
      }
    );
  });
}

function deleteMaterialPayment(paymentId) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM material_payment WHERE id = ?", [paymentId], function onDelete(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.changes);
    });
  });
}

module.exports = {
  getNextMaterialReceiptNo,
  insertMaterialPayment,
  listMaterialPayments,
  getMaterialPaymentById,
  updateMaterialPayment,
  deleteMaterialPayment
};
