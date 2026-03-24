const express = require("express");
const {
  getNextMaterialInNo,
  insertMaterialIn,
  listMaterialIns,
  getMaterialInById,
  listMaterialInItems,
  updateMaterialIn,
  deleteMaterialIn
} = require("../repositories/materialInRepository");

const router = express.Router();

router.get("/material-in/next-no", async (req, res) => {
  try {
    const challanNo = await getNextMaterialInNo();
    res.json({ challanNo });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate challan number." });
  }
});

router.get("/material-in", async (req, res) => {
  try {
    const challans = await listMaterialIns();
    res.json({ challans });
  } catch (error) {
    res.status(500).json({ error: "Failed to load material in records." });
  }
});

router.get("/material-in/:id", async (req, res) => {
  const challanId = Number(req.params.id);
  if (Number.isNaN(challanId) || challanId <= 0) {
    res.status(400).json({ error: "Invalid challan id." });
    return;
  }

  try {
    const challan = await getMaterialInById(challanId);
    if (!challan) {
      res.status(404).json({ error: "Material in not found." });
      return;
    }
    const items = await listMaterialInItems(challanId);
    res.json({ challan, items });
  } catch (error) {
    res.status(500).json({ error: "Failed to load material in." });
  }
});

router.post("/material-in", async (req, res) => {
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

    if (Number.isNaN(Number(item.materialOutItemId)) || Number(item.materialOutItemId) <= 0) {
      res.status(400).json({ error: "Material out challan is required." });
      return;
    }

    const unit = typeof item.unit === "string" ? item.unit : "";
    if (!unit || !["per_kg", "per_pcs"].includes(unit)) {
      res.status(400).json({ error: "Unit must be per kg or per pcs." });
      return;
    }

    if (Number.isNaN(Number(item.rate))) {
      res.status(400).json({ error: "Rate must be a number." });
      return;
    }
  }

  try {
    const challan = await insertMaterialIn({
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
    if (error && error.message) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Failed to save material in." });
  }
});

router.put("/material-in/:id", async (req, res) => {
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

    if (Number.isNaN(Number(item.materialOutItemId)) || Number(item.materialOutItemId) <= 0) {
      res.status(400).json({ error: "Material out challan is required." });
      return;
    }

    const unit = typeof item.unit === "string" ? item.unit : "";
    if (!unit || !["per_kg", "per_pcs"].includes(unit)) {
      res.status(400).json({ error: "Unit must be per kg or per pcs." });
      return;
    }

    if (Number.isNaN(Number(item.rate))) {
      res.status(400).json({ error: "Rate must be a number." });
      return;
    }
  }

  try {
    const existing = await getMaterialInById(challanId);
    if (!existing) {
      res.status(404).json({ error: "Material in not found." });
      return;
    }

    const challan = await updateMaterialIn(challanId, {
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
    res.status(500).json({ error: "Failed to update material in." });
  }
});

router.delete("/material-in/:id", async (req, res) => {
  const challanId = Number(req.params.id);
  if (Number.isNaN(challanId) || challanId <= 0) {
    res.status(400).json({ error: "Invalid challan id." });
    return;
  }

  try {
    const existing = await getMaterialInById(challanId);
    if (!existing) {
      res.status(404).json({ error: "Material in not found." });
      return;
    }

    await deleteMaterialIn(challanId);
    res.json({ success: true });
  } catch (error) {
    if (error && error.message) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Failed to delete material in." });
  }
});

module.exports = router;
