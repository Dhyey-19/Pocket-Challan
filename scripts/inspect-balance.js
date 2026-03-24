const sqlite3 = require("sqlite3").verbose();

const partyName = process.argv[2] || "Gadhvi Bhai";
const itemName = process.argv[3] || "Brass Road";

const db = new sqlite3.Database("data/app.db");

const outSql =
  "SELECT mo.id AS materialOutId, mo.challanNo, mo.challanDate, pm.partyName, im.itemName, moi.id AS materialOutItemId, moi.netWeight, moi.pcs, moi.weightBalance, moi.pcsBalance " +
  "FROM material_out mo " +
  "JOIN party_master pm ON pm.id=mo.partyId " +
  "JOIN material_out_items moi ON moi.materialOutId=mo.id " +
  "JOIN item_master im ON im.id=moi.itemId " +
  "WHERE pm.partyName=? AND im.itemName=? " +
  "ORDER BY mo.challanNo ASC";

db.all(outSql, [partyName, itemName], (err, outRows) => {
  if (err) {
    console.error(err);
    db.close();
    return;
  }

  console.log("Material out rows:");
  console.log(outRows);

  const ids = (outRows || []).map((row) => row.materialOutItemId);
  if (!ids.length) {
    db.close();
    return;
  }

  const placeholders = ids.map(() => "?").join(",");
  const inSql =
    "SELECT mii.id, mii.materialOutItemId, mi.challanNo, mi.challanDate, mii.netWeight, mii.pcs " +
    "FROM material_in_items mii " +
    "JOIN material_in mi ON mi.id=mii.materialInId " +
    `WHERE mii.materialOutItemId IN (${placeholders}) ` +
    "ORDER BY mi.challanNo ASC, mii.id ASC";

  db.all(inSql, ids, (err2, inRows) => {
    if (err2) {
      console.error(err2);
    } else {
      console.log("Material in usage:");
      console.log(inRows);
    }
    db.close();
  });
});
