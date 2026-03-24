const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const baseDir = process.pkg ? process.cwd() : path.join(__dirname, "..");
const dataDir = path.join(baseDir, "data");
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "app.db");
let db = new sqlite3.Database(dbPath);

function initDb() {
  db.serialize(() => {
    const bootTimestamp = new Date().toISOString();

    const addColumn = (table, columnDef) => {
      db.run(`ALTER TABLE ${table} ADD COLUMN ${columnDef}`, [], (err) => {
        if (err && !String(err.message || "").includes("duplicate column name")) {
          console.error(err);
        }
      });
    };

    db.run(
      "CREATE TABLE IF NOT EXISTS company (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, createdAt TEXT NOT NULL)"
    );
    db.run(
      "INSERT INTO company (name, createdAt) SELECT ?, ? WHERE NOT EXISTS (SELECT 1 FROM company)",
      ["Pocket Challan", bootTimestamp]
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS app_registration (id INTEGER PRIMARY KEY AUTOINCREMENT, randomCode TEXT NOT NULL, verified INTEGER NOT NULL DEFAULT 0, verifiedAt TEXT)"
    );
    addColumn("app_registration", "machineHash TEXT");
    db.run(
      "CREATE TABLE IF NOT EXISTS user_master (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, createdAt TEXT NOT NULL)"
    );
    db.run(
      "INSERT INTO user_master (username, password, createdAt) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM user_master WHERE username = ?)",
      ["admin", "password", bootTimestamp, "admin"]
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS party_master (id INTEGER PRIMARY KEY AUTOINCREMENT, partyName TEXT NOT NULL, openingBalance REAL NOT NULL DEFAULT 0)"
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS item_master (id INTEGER PRIMARY KEY AUTOINCREMENT, itemName TEXT NOT NULL)"
    );
    db.all("PRAGMA table_info(item_master)", [], (err, columns) => {
      if (err) {
        console.error(err);
        return;
      }

      const columnNames = (columns || []).map((column) => column.name);
      const expectedColumns = ["id", "itemName"];
      const hasExpectedColumns =
        expectedColumns.every((column) => columnNames.includes(column)) &&
        columnNames.length === expectedColumns.length;

      if (hasExpectedColumns) {
        return;
      }

      db.run("BEGIN TRANSACTION", [], (beginErr) => {
        if (beginErr) {
          console.error(beginErr);
          return;
        }

        db.run(
          "CREATE TABLE item_master_new (id INTEGER PRIMARY KEY AUTOINCREMENT, itemName TEXT NOT NULL)",
          [],
          (createErr) => {
            if (createErr) {
              console.error(createErr);
              db.run("ROLLBACK");
              return;
            }

            db.run(
              "INSERT INTO item_master_new (id, itemName) SELECT id, itemName FROM item_master",
              [],
              (insertErr) => {
                if (insertErr) {
                  console.error(insertErr);
                  db.run("ROLLBACK");
                  return;
                }

                db.run("DROP TABLE item_master", [], (dropErr) => {
                  if (dropErr) {
                    console.error(dropErr);
                    db.run("ROLLBACK");
                    return;
                  }

                  db.run(
                    "ALTER TABLE item_master_new RENAME TO item_master",
                    [],
                    (renameErr) => {
                      if (renameErr) {
                        console.error(renameErr);
                        db.run("ROLLBACK");
                        return;
                      }

                      db.run("COMMIT", [], (commitErr) => {
                        if (commitErr) {
                          console.error(commitErr);
                          db.run("ROLLBACK");
                        }
                      });
                    }
                  );
                });
              }
            );
          }
        );
      });
    });
    db.run(
      "CREATE TABLE IF NOT EXISTS sales_payment (id INTEGER PRIMARY KEY AUTOINCREMENT, receiptNo INTEGER NOT NULL, receiptDate TEXT NOT NULL, partyId INTEGER NOT NULL, amount REAL NOT NULL, transactionType TEXT NOT NULL, remarks TEXT, createdAt TEXT NOT NULL)"
    );
    db.run(
      "CREATE UNIQUE INDEX IF NOT EXISTS idx_sales_payment_receipt_no ON sales_payment (receiptNo)"
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS material_payment (id INTEGER PRIMARY KEY AUTOINCREMENT, receiptNo INTEGER NOT NULL, receiptDate TEXT NOT NULL, partyId INTEGER NOT NULL, amount REAL NOT NULL, transactionType TEXT NOT NULL, remarks TEXT, createdAt TEXT NOT NULL)"
    );
    db.run(
      "CREATE UNIQUE INDEX IF NOT EXISTS idx_material_payment_receipt_no ON material_payment (receiptNo)"
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS challan_sales (id INTEGER PRIMARY KEY AUTOINCREMENT, challanNo INTEGER NOT NULL, challanDate TEXT NOT NULL, partyId INTEGER NOT NULL, remarks TEXT, billNo TEXT, vehicleNo TEXT, createdAt TEXT NOT NULL)"
    );
    db.run(
      "CREATE UNIQUE INDEX IF NOT EXISTS idx_challan_sales_no ON challan_sales (challanNo)"
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS challan_sales_items (id INTEGER PRIMARY KEY AUTOINCREMENT, challanId INTEGER NOT NULL, itemId INTEGER NOT NULL, grossWeight REAL NOT NULL, bagsCrate REAL NOT NULL, lessWeight REAL NOT NULL, netWeight REAL NOT NULL, pcs REAL NOT NULL, unit TEXT NOT NULL, rate REAL NOT NULL, amount REAL NOT NULL, notes TEXT)"
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS material_out (id INTEGER PRIMARY KEY AUTOINCREMENT, challanNo INTEGER NOT NULL, challanDate TEXT NOT NULL, partyId INTEGER NOT NULL, remarks TEXT, vehicleNo TEXT, createdAt TEXT NOT NULL)"
    );
    db.run(
      "CREATE UNIQUE INDEX IF NOT EXISTS idx_material_out_no ON material_out (challanNo)"
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS material_out_items (id INTEGER PRIMARY KEY AUTOINCREMENT, materialOutId INTEGER NOT NULL, itemId INTEGER NOT NULL, grossWeight REAL NOT NULL, bagsCrate REAL NOT NULL, lessWeight REAL NOT NULL, netWeight REAL NOT NULL, pcs REAL NOT NULL, processType TEXT, weightBalance REAL, pcsBalance REAL)"
    );
    addColumn("material_out_items", "weightBalance REAL");
    addColumn("material_out_items", "pcsBalance REAL");
    db.run(
      "UPDATE material_out_items SET weightBalance = netWeight WHERE weightBalance IS NULL"
    );
    db.run(
      "UPDATE material_out_items SET pcsBalance = pcs WHERE pcsBalance IS NULL"
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS material_in (id INTEGER PRIMARY KEY AUTOINCREMENT, challanNo INTEGER NOT NULL, challanDate TEXT NOT NULL, partyId INTEGER NOT NULL, remarks TEXT, vehicleNo TEXT, createdAt TEXT NOT NULL)"
    );
    db.run(
      "CREATE UNIQUE INDEX IF NOT EXISTS idx_material_in_no ON material_in (challanNo)"
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS material_in_items (id INTEGER PRIMARY KEY AUTOINCREMENT, materialInId INTEGER NOT NULL, itemId INTEGER NOT NULL, materialInItemName TEXT, materialOutItemId INTEGER, grossWeight REAL NOT NULL, bagsCrate REAL NOT NULL, lessWeight REAL NOT NULL, netWeight REAL NOT NULL, pcs REAL NOT NULL, unit TEXT NOT NULL, rate REAL NOT NULL, amount REAL NOT NULL, processType TEXT, weightBalance REAL NOT NULL, pcsBalance REAL NOT NULL)"
    );
    addColumn("material_in_items", "materialOutItemId INTEGER");
    addColumn("material_in_items", "materialInItemName TEXT");
    addColumn("material_in_items", "weightBalance REAL");
    addColumn("material_in_items", "pcsBalance REAL");
  });
}

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this);
    });
  });
}

function closeDb() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function getDbPath() {
  return dbPath;
}

module.exports = {
  db,
  initDb,
  runAsync,
  closeDb,
  getDbPath
};
