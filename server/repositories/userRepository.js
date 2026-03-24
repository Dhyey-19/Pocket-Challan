const { db } = require("../db");

function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, username, password FROM user_master WHERE username = ?",
      [username],
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

function insertUser(username, password) {
  return new Promise((resolve, reject) => {
    const createdAt = new Date().toISOString();
    db.run(
      "INSERT INTO user_master (username, password, createdAt) VALUES (?, ?, ?)",
      [username, password, createdAt],
      function onInsert(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID, username, createdAt });
      }
    );
  });
}

function updateUserPassword(username, password) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE user_master SET password = ? WHERE username = ?",
      [password, username],
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

module.exports = {
  getUserByUsername,
  insertUser,
  updateUserPassword
};
