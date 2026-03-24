const express = require("express");
const { getPartyById } = require("../repositories/partyRepository");
const {
  listMaterialOutByPartyAndDate,
  listMaterialInByPartyAndDate,
  listMaterialPaymentsByPartyAndDate
} = require("../repositories/materialReportRepository");

const router = express.Router();

router.get("/material-inout-report", async (req, res) => {
  const partyId = Number(req.query.partyId);
  const startDate = typeof req.query.startDate === "string" ? req.query.startDate.trim() : "";
  const endDate = typeof req.query.endDate === "string" ? req.query.endDate.trim() : "";

  if (Number.isNaN(partyId) || partyId <= 0) {
    res.status(400).json({ error: "Party is required." });
    return;
  }

  if (!startDate || !endDate) {
    res.status(400).json({ error: "Start and end date are required." });
    return;
  }

  try {
    const party = await getPartyById(partyId);
    if (!party) {
      res.status(404).json({ error: "Party not found." });
      return;
    }

    const [outward, inward, payments] = await Promise.all([
      listMaterialOutByPartyAndDate(partyId, startDate, endDate),
      listMaterialInByPartyAndDate(partyId, startDate, endDate),
      listMaterialPaymentsByPartyAndDate(partyId, startDate, endDate)
    ]);

    res.json({
      party,
      outward,
      inward,
      payments
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load material in-out report." });
  }
});

module.exports = router;
