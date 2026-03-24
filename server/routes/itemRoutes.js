const express = require("express");
const { listItems, insertItem, updateItem, deleteItem } = require("../repositories/itemRepository");

const router = express.Router();

router.get("/items", async (req, res) => {
  try {
    const items = await listItems();
    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: "Failed to load items." });
  }
});

router.post("/items", async (req, res) => {
  const itemName = typeof req.body.itemName === "string" ? req.body.itemName.trim() : "";
  if (!itemName) {
    res.status(400).json({ error: "Item name is required." });
    return;
  }

  try {
    const item = await insertItem(itemName);
    res.status(201).json({ item });
  } catch (error) {
    res.status(500).json({ error: "Failed to save item." });
  }
});

router.put("/items/:itemId", async (req, res) => {
  const itemId = Number(req.params.itemId);
  const itemName = typeof req.body.itemName === "string" ? req.body.itemName.trim() : "";

  if (Number.isNaN(itemId) || itemId <= 0) {
    res.status(400).json({ error: "Invalid item id." });
    return;
  }

  if (!itemName) {
    res.status(400).json({ error: "Item name is required." });
    return;
  }

  try {
    const item = await updateItem(itemId, itemName);
    if (!item.updated) {
      res.status(404).json({ error: "Item not found." });
      return;
    }
    res.json({ item: { id: item.id, itemName: item.itemName } });
  } catch (error) {
    res.status(500).json({ error: "Failed to update item." });
  }
});

router.delete("/items/:itemId", async (req, res) => {
  const itemId = Number(req.params.itemId);
  if (Number.isNaN(itemId) || itemId <= 0) {
    res.status(400).json({ error: "Invalid item id." });
    return;
  }

  try {
    const result = await deleteItem(itemId);
    if (!result.deleted) {
      res.status(404).json({ error: "Item not found." });
      return;
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete item." });
  }
});

module.exports = router;
