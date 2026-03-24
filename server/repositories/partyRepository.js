const { db } = require("../db");

function listParties() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT id, partyName, openingBalance FROM party_master ORDER BY id ASC",
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

function insertParty(partyName, openingBalance) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO party_master (partyName, openingBalance) VALUES (?, ?)",
      [partyName, openingBalance],
      function onInsert(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID, partyName, openingBalance });
      }
    );
  });
}

function getPartyById(partyId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, partyName, openingBalance FROM party_master WHERE id = ?",
      [partyId],
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

function listPaymentOutstanding() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT pm.id, pm.partyName, pm.openingBalance, COALESCE(cs.totalChallan, 0) AS challanTotal, COALESCE(sp.totalPayment, 0) AS paymentsTotal, (COALESCE(pm.openingBalance, 0) + COALESCE(cs.totalChallan, 0) - COALESCE(sp.totalPayment, 0)) AS outstandingBalance FROM party_master pm LEFT JOIN (SELECT partyId, SUM(amount) AS totalChallan FROM challan_sales_items csi JOIN challan_sales cs ON cs.id = csi.challanId GROUP BY partyId) cs ON cs.partyId = pm.id LEFT JOIN (SELECT partyId, SUM(amount) AS totalPayment FROM sales_payment GROUP BY partyId) sp ON sp.partyId = pm.id WHERE ABS(COALESCE(pm.openingBalance, 0) + COALESCE(cs.totalChallan, 0) - COALESCE(sp.totalPayment, 0)) > 0.000001 ORDER BY pm.partyName ASC",
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

function updateParty(partyId, partyName, openingBalance) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE party_master SET partyName = ?, openingBalance = ? WHERE id = ?",
      [partyName, openingBalance, partyId],
      function onUpdate(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: partyId, partyName, openingBalance });
      }
    );
  });
}

function deleteParty(partyId) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM party_master WHERE id = ?", [partyId], function onDelete(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ deleted: this.changes > 0 });
    });
  });
}

function deleteAllParties() {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM party_master", [], function onDeleteAll(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ deletedCount: this.changes || 0 });
    });
  });
}

module.exports = {
  listParties,
  insertParty,
  getPartyById,
  listPaymentOutstanding,
  updateParty,
  deleteParty,
  deleteAllParties
};
