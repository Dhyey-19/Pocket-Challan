const { db } = require("../db");

function listItems() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT id, itemName FROM item_master ORDER BY id ASC",
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

function insertItem(itemName) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO item_master (itemName) VALUES (?)",
      [itemName],
      function onInsert(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID, itemName });
      }
    );
  });
}

function updateItem(itemId, itemName) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE item_master SET itemName = ? WHERE id = ?",
      [itemName, itemId],
      function onUpdate(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: itemId, itemName, updated: this.changes > 0 });
      }
    );
  });
}

function deleteItem(itemId) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM item_master WHERE id = ?", [itemId], function onDelete(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ deleted: this.changes > 0 });
    });
  });
}

module.exports = {
  listItems,
  insertItem,
  updateItem,
  deleteItem
};
