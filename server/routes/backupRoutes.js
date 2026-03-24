const express = require("express");
const fs = require("fs");
const path = require("path");

const { closeDb, getDbPath } = require("../db");

const router = express.Router();

router.get("/backup", (req, res) => {
  const dbPath = getDbPath();
  const stamp = new Date().toISOString().slice(0, 10);
  const fileName = `pocket-challan-backup-${stamp}.db`;

  res.download(dbPath, fileName, (err) => {
    if (err) {
      res.status(500).json({ error: "Unable to download backup." });
    }
  });
});

router.put(
  "/backup/restore",
  express.raw({ type: "application/octet-stream", limit: "200mb" }),
  async (req, res) => {
    if (!req.body || !req.body.length) {
      res.status(400).json({ error: "Backup file is required." });
      return;
    }

    const dbPath = getDbPath();
    const dataDir = path.dirname(dbPath);
    const tempPath = path.join(dataDir, "app.db.restore");

    try {
      await closeDb();
      fs.writeFileSync(tempPath, req.body);
      fs.copyFileSync(tempPath, dbPath);
      fs.unlinkSync(tempPath);

      res.json({ status: "ok" });
      setTimeout(() => {
        process.exit(0);
      }, 500);
    } catch (err) {
      res.status(500).json({ error: "Unable to restore backup." });
    }
  }
);

module.exports = router;
