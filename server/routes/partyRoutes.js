const express = require("express");
const {
  listParties,
  insertParty,
  getPartyById,
  listPaymentOutstanding,
  updateParty,
  deleteParty,
  deleteAllParties
} = require("../repositories/partyRepository");
const {
  listSalesPaymentsByPartyAndDate,
  sumSalesPaymentsBeforeDate
} = require("../repositories/salesPaymentRepository");
const {
  listChallanSalesItemsByPartyAndDate,
  sumChallanSalesAmountBeforeDate
} = require("../repositories/challanSalesRepository");

const router = express.Router();

router.get("/parties", async (req, res) => {
  try {
    const parties = await listParties();
    res.json({ parties });
  } catch (error) {
    res.status(500).json({ error: "Failed to load parties." });
  }
});

router.post("/parties", async (req, res) => {
  const partyName = typeof req.body.partyName === "string" ? req.body.partyName.trim() : "";
  const openingBalance = Number(req.body.openingBalance);

  if (!partyName) {
    res.status(400).json({ error: "Party name is required." });
    return;
  }

  if (Number.isNaN(openingBalance)) {
    res.status(400).json({ error: "Opening balance must be a number." });
    return;
  }

  try {
    const party = await insertParty(partyName, openingBalance);
    res.status(201).json({ party });
  } catch (error) {
    res.status(500).json({ error: "Failed to save party." });
  }
});

router.put("/parties/:partyId", async (req, res) => {
  const partyId = Number(req.params.partyId);
  const partyName = typeof req.body.partyName === "string" ? req.body.partyName.trim() : "";
  const openingBalance = Number(req.body.openingBalance);

  if (Number.isNaN(partyId) || partyId <= 0) {
    res.status(400).json({ error: "Invalid party id." });
    return;
  }

  if (!partyName) {
    res.status(400).json({ error: "Party name is required." });
    return;
  }

  if (Number.isNaN(openingBalance)) {
    res.status(400).json({ error: "Opening balance must be a number." });
    return;
  }

  try {
    const party = await updateParty(partyId, partyName, openingBalance);
    res.json({ party });
  } catch (error) {
    res.status(500).json({ error: "Failed to update party." });
  }
});

router.delete("/parties/:partyId", async (req, res) => {
  const partyId = Number(req.params.partyId);
  if (Number.isNaN(partyId) || partyId <= 0) {
    res.status(400).json({ error: "Invalid party id." });
    return;
  }

  try {
    const result = await deleteParty(partyId);
    if (!result.deleted) {
      res.status(404).json({ error: "Party not found." });
      return;
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete party." });
  }
});

router.delete("/parties", async (req, res) => {
  try {
    const result = await deleteAllParties();
    res.json({ ok: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete all parties." });
  }
});

router.get("/party-statement", async (req, res) => {
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

    const challanRows = await listChallanSalesItemsByPartyAndDate(
      partyId,
      startDate,
      endDate
    );
    const paymentRows = await listSalesPaymentsByPartyAndDate(
      partyId,
      startDate,
      endDate
    );

    const challanBefore = await sumChallanSalesAmountBeforeDate(partyId, startDate);
    const paymentBefore = await sumSalesPaymentsBeforeDate(partyId, startDate);
    const openingBalance =
      Number(party.openingBalance || 0) + Number(challanBefore || 0) - Number(paymentBefore || 0);

    const rows = [];

    challanRows.forEach((row) => {
      rows.push({
        type: "challan",
        challanNo: row.challanNo,
        date: row.challanDate,
        product: row.itemName,
        notes: row.notes || "",
        netWeight: Number(row.netWeight || 0),
        pcs: Number(row.pcs || 0),
        unit: row.unit || "",
        rate: Number(row.rate || 0),
        amount: Number(row.amount || 0)
      });
    });

    paymentRows.forEach((row) => {
      rows.push({
        type: "payment",
        challanNo: "",
        date: row.receiptDate,
        product: row.transactionType ? row.transactionType.toUpperCase() : "PAYMENT",
        netWeight: 0,
        pcs: 0,
        unit: "",
        rate: 0,
        amount: -Number(row.amount || 0)
      });
    });

    rows.sort((a, b) => {
      const dateCompare = String(a.date || "").localeCompare(String(b.date || ""));
      if (dateCompare !== 0) {
        return dateCompare;
      }
      if (a.type !== b.type) {
        return a.type === "challan" ? -1 : 1;
      }
      return Number(a.challanNo || 0) - Number(b.challanNo || 0);
    });

    res.json({
      party,
      openingBalance,
      rows,
      payments: paymentRows
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load party statement." });
  }
});

router.get("/payment-outstanding", async (req, res) => {
  try {
    const parties = await listPaymentOutstanding();
    res.json({ parties });
  } catch (error) {
    res.status(500).json({ error: "Failed to load payment outstanding records." });
  }
});

module.exports = router;
