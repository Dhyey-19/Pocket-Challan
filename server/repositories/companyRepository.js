const { db } = require("../db");

function getCompany() {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, name, createdAt FROM company ORDER BY id ASC LIMIT 1",
      [],
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

function insertCompany(name) {
  return new Promise((resolve, reject) => {
    const createdAt = new Date().toISOString();
    db.run(
      "INSERT INTO company (name, createdAt) VALUES (?, ?)",
      [name, createdAt],
      function onInsert(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID, name, createdAt });
      }
    );
  });
}

function updateCompany(id, name) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE company SET name = ? WHERE id = ?",
      [name, id],
      function onUpdate(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id, name });
      }
    );
  });
}

module.exports = {
  getCompany,
  insertCompany,
  updateCompany
};
