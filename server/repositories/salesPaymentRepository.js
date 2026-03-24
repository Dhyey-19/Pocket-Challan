const { db } = require("../db");

function getNextReceiptNo() {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COALESCE(MAX(receiptNo), 0) AS maxReceipt FROM sales_payment",
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

function insertSalesPayment(payload) {
  return new Promise((resolve, reject) => {
    const createdAt = new Date().toISOString();
    db.run(
      "INSERT INTO sales_payment (receiptNo, receiptDate, partyId, amount, transactionType, remarks, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
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

function listSalesPayments() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT sp.id, sp.receiptNo, sp.receiptDate, sp.partyId, pm.partyName, sp.amount, sp.transactionType, sp.remarks FROM sales_payment sp JOIN party_master pm ON pm.id = sp.partyId ORDER BY sp.receiptNo ASC",
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

function getSalesPaymentById(paymentId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT sp.id, sp.receiptNo, sp.receiptDate, sp.partyId, pm.partyName, sp.amount, sp.transactionType, sp.remarks FROM sales_payment sp JOIN party_master pm ON pm.id = sp.partyId WHERE sp.id = ?",
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

function updateSalesPayment(paymentId, payload) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE sales_payment SET receiptNo = ?, receiptDate = ?, partyId = ?, amount = ?, transactionType = ?, remarks = ? WHERE id = ?",
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

function deleteSalesPayment(paymentId) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM sales_payment WHERE id = ?", [paymentId], function onDelete(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.changes);
    });
  });
}

function listSalesPaymentsByPartyAndDate(partyId, startDate, endDate) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT sp.id, sp.receiptNo, sp.receiptDate, sp.partyId, sp.amount, sp.transactionType, sp.remarks FROM sales_payment sp WHERE sp.partyId = ? AND sp.receiptDate BETWEEN ? AND ? ORDER BY sp.receiptDate ASC, sp.receiptNo ASC",
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

function sumSalesPaymentsBeforeDate(partyId, beforeDate) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM sales_payment WHERE partyId = ? AND receiptDate < ?",
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
  getNextReceiptNo,
  insertSalesPayment,
  listSalesPayments,
  getSalesPaymentById,
  updateSalesPayment,
  deleteSalesPayment,
  listSalesPaymentsByPartyAndDate,
  sumSalesPaymentsBeforeDate
};
