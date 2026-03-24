const express = require("express");
const {
  getNextMaterialOutNo,
  insertMaterialOut,
  listMaterialOuts,
  getMaterialOutById,
  listMaterialOutItems,
  listMaterialOutParties,
  listMaterialOutItemsMaster,
  listMaterialOutBalancesByItem,
  listMaterialOutstandingByDate,
  updateMaterialOut,
  deleteMaterialOut
} = require("../repositories/materialOutRepository");

const router = express.Router();

router.get("/material-out/next-no", async (req, res) => {
  try {
    const challanNo = await getNextMaterialOutNo();
    res.json({ challanNo });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate challan number." });
  }
});

router.get("/material-out", async (req, res) => {
  try {
    const challans = await listMaterialOuts();
    res.json({ challans });
  } catch (error) {
    res.status(500).json({ error: "Failed to load material out records." });
  }
});

router.get("/material-out/parties", async (req, res) => {
  try {
    const parties = await listMaterialOutParties();
    res.json({ parties });
  } catch (error) {
    res.status(500).json({ error: "Failed to load parties." });
  }
});

router.get("/material-out/items", async (req, res) => {
  try {
    const partyId = req.query.partyId ? Number(req.query.partyId) : null;
    if (req.query.partyId && (Number.isNaN(partyId) || partyId <= 0)) {
      res.status(400).json({ error: "Invalid party id." });
      return;
    }
    const items = await listMaterialOutItemsMaster(partyId);
    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: "Failed to load items." });
  }
});

router.get("/material-out/items/:itemId/challans", async (req, res) => {
  const itemId = Number(req.params.itemId);
  if (Number.isNaN(itemId) || itemId <= 0) {
    res.status(400).json({ error: "Invalid item id." });
    return;
  }

  const partyId = req.query.partyId ? Number(req.query.partyId) : null;
  if (req.query.partyId && (Number.isNaN(partyId) || partyId <= 0)) {
    res.status(400).json({ error: "Invalid party id." });
    return;
  }

  try {
    const challans = await listMaterialOutBalancesByItem(itemId, partyId);
    res.json({ challans });
  } catch (error) {
    res.status(500).json({ error: "Failed to load challans." });
  }
});

router.get("/material-outstanding", async (req, res) => {
  const startDate = typeof req.query.startDate === "string" ? req.query.startDate.trim() : "";
  const endDate = typeof req.query.endDate === "string" ? req.query.endDate.trim() : "";

  if (!startDate || !endDate) {
    res.status(400).json({ error: "Start and end date are required." });
    return;
  }

  try {
    const records = await listMaterialOutstandingByDate(startDate, endDate);
    res.json({ records });
  } catch (error) {
    res.status(500).json({ error: "Failed to load material outstanding records." });
  }
});

router.get("/material-out/:id", async (req, res) => {
  const challanId = Number(req.params.id);
  if (Number.isNaN(challanId) || challanId <= 0) {
    res.status(400).json({ error: "Invalid challan id." });
    return;
  }

  try {
    const challan = await getMaterialOutById(challanId);
    if (!challan) {
      res.status(404).json({ error: "Material out not found." });
      return;
    }
    const items = await listMaterialOutItems(challanId);
    res.json({ challan, items });
  } catch (error) {
    res.status(500).json({ error: "Failed to load material out." });
  }
});

router.post("/material-out", async (req, res) => {
  const challanNo = Number(req.body.challanNo);
  const challanDate = typeof req.body.challanDate === "string" ? req.body.challanDate.trim() : "";
  const partyId = Number(req.body.partyId);
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const remarks = typeof req.body.remarks === "string" ? req.body.remarks.trim() : "";
  const vehicleNo = typeof req.body.vehicleNo === "string" ? req.body.vehicleNo.trim() : "";

  if (Number.isNaN(challanNo) || challanNo <= 0) {
    res.status(400).json({ error: "Challan number must be a positive number." });
    return;
  }

  if (!challanDate) {
    res.status(400).json({ error: "Challan date is required." });
    return;
  }

  if (Number.isNaN(partyId) || partyId <= 0) {
    res.status(400).json({ error: "Party is required." });
    return;
  }

  if (items.length === 0) {
    res.status(400).json({ error: "At least one item is required." });
    return;
  }

  for (const item of items) {
    if (Number.isNaN(Number(item.itemId)) || Number(item.itemId) <= 0) {
      res.status(400).json({ error: "Item is required." });
      return;
    }
  }

  try {
    const challan = await insertMaterialOut({
      challanNo,
      challanDate,
      partyId,
      remarks,
      vehicleNo,
      items
    });
    res.status(201).json({ challan });
  } catch (error) {
    if (error && error.message && error.message.includes("UNIQUE")) {
      res.status(409).json({ error: "Challan number already exists." });
      return;
    }
    res.status(500).json({ error: "Failed to save material out." });
  }
});

router.put("/material-out/:id", async (req, res) => {
  const challanId = Number(req.params.id);
  const challanNo = Number(req.body.challanNo);
  const challanDate = typeof req.body.challanDate === "string" ? req.body.challanDate.trim() : "";
  const partyId = Number(req.body.partyId);
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const remarks = typeof req.body.remarks === "string" ? req.body.remarks.trim() : "";
  const vehicleNo = typeof req.body.vehicleNo === "string" ? req.body.vehicleNo.trim() : "";

  if (Number.isNaN(challanId) || challanId <= 0) {
    res.status(400).json({ error: "Invalid challan id." });
    return;
  }

  if (Number.isNaN(challanNo) || challanNo <= 0) {
    res.status(400).json({ error: "Challan number must be a positive number." });
    return;
  }

  if (!challanDate) {
    res.status(400).json({ error: "Challan date is required." });
    return;
  }

  if (Number.isNaN(partyId) || partyId <= 0) {
    res.status(400).json({ error: "Party is required." });
    return;
  }

  if (items.length === 0) {
    res.status(400).json({ error: "At least one item is required." });
    return;
  }

  for (const item of items) {
    if (Number.isNaN(Number(item.itemId)) || Number(item.itemId) <= 0) {
      res.status(400).json({ error: "Item is required." });
      return;
    }
  }

  try {
    const existing = await getMaterialOutById(challanId);
    if (!existing) {
      res.status(404).json({ error: "Material out not found." });
      return;
    }

    const challan = await updateMaterialOut(challanId, {
      challanNo,
      challanDate,
      partyId,
      remarks,
      vehicleNo,
      items
    });
    res.json({ challan });
  } catch (error) {
    if (error && error.message && error.message.includes("UNIQUE")) {
      res.status(409).json({ error: "Challan number already exists." });
      return;
    }
    if (error && error.message) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Failed to update material out." });
  }
});

router.delete("/material-out/:id", async (req, res) => {
  const challanId = Number(req.params.id);
  if (Number.isNaN(challanId) || challanId <= 0) {
    res.status(400).json({ error: "Invalid challan id." });
    return;
  }

  try {
    const existing = await getMaterialOutById(challanId);
    if (!existing) {
      res.status(404).json({ error: "Material out not found." });
      return;
    }

    await deleteMaterialOut(challanId);
    res.json({ success: true });
  } catch (error) {
    if (error && error.message) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Failed to delete material out." });
  }
});

module.exports = router;
