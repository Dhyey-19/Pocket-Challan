const { db } = require("../db");

function generateRandomCode() {
  const value = Math.floor(1000000000 + Math.random() * 9000000000);
  return String(value);
}

function calculateRegistrationKey(randomCode) {
  const source = `${String(randomCode || "")}POCKETCHALLAN`.replace(/\s+/g, " ").trim();
  const asciiSum = source.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  let result = asciiSum * 10252;
  if (result < 0) {
    result *= -1;
  }
  return result;
}

function getRegistration() {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, randomCode, verified, verifiedAt, machineHash FROM app_registration ORDER BY id ASC LIMIT 1",
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

function createRegistration(randomCode) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO app_registration (randomCode, verified, verifiedAt) VALUES (?, 0, NULL)",
      [randomCode],
      function onInsert(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID, randomCode, verified: 0, verifiedAt: null });
      }
    );
  });
}

function updateRegistrationCode(registrationId, randomCode) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE app_registration SET randomCode = ? WHERE id = ?",
      [randomCode, registrationId],
      function onUpdate(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ changes: this.changes });
      }
    );
  });
}

function markRegistrationVerified(registrationId, machineHash) {
  return new Promise((resolve, reject) => {
    const verifiedAt = new Date().toISOString();
    db.run(
      "UPDATE app_registration SET verified = 1, verifiedAt = ?, machineHash = ? WHERE id = ?",
      [verifiedAt, machineHash, registrationId],
      function onUpdate(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ changes: this.changes, verifiedAt });
      }
    );
  });
}

async function getOrCreateRegistration() {
  const existing = await getRegistration();
  if (existing) {
    return existing;
  }

  const randomCode = generateRandomCode();
  return createRegistration(randomCode);
}

async function getRegistrationForStatus() {
  const existing = await getRegistration();
  if (!existing) {
    const randomCode = generateRandomCode();
    return createRegistration(randomCode);
  }

  if (existing.verified) {
    return existing;
  }

  const randomCode = generateRandomCode();
  await updateRegistrationCode(existing.id, randomCode);
  return { ...existing, randomCode };
}

module.exports = {
  calculateRegistrationKey,
  getRegistration,
  getOrCreateRegistration,
  getRegistrationForStatus,
  markRegistrationVerified
};
