const express = require("express");
const { getCompany, insertCompany, updateCompany } = require("../repositories/companyRepository");

const router = express.Router();

router.get("/company", async (req, res) => {
  try {
    const company = await getCompany();
    res.json({ exists: Boolean(company), company });
  } catch (error) {
    res.status(500).json({ error: "Failed to load company." });
  }
});

router.post("/company", async (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  if (!name) {
    res.status(400).json({ error: "Company name is required." });
    return;
  }

  try {
    const existing = await getCompany();
    if (existing) {
      res.status(409).json({ error: "Company is already configured." });
      return;
    }

    const company = await insertCompany(name);
    res.status(201).json({ company });
  } catch (error) {
    res.status(500).json({ error: "Failed to save company." });
  }
});

router.put("/company", async (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  if (!name) {
    res.status(400).json({ error: "Company name is required." });
    return;
  }

  try {
    const existing = await getCompany();
    if (!existing) {
      res.status(404).json({ error: "Company is not configured." });
      return;
    }

    const company = await updateCompany(existing.id, name);
    res.json({ company: { ...existing, ...company } });
  } catch (error) {
    res.status(500).json({ error: "Failed to update company." });
  }
});

module.exports = router;
