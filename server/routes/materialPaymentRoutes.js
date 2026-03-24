const express = require("express");
const {
  getNextMaterialReceiptNo,
  insertMaterialPayment,
  listMaterialPayments,
  getMaterialPaymentById,
  updateMaterialPayment,
  deleteMaterialPayment
} = require("../repositories/materialPaymentRepository");

const router = express.Router();

router.get("/material-payments/next-receipt", async (req, res) => {
  try {
    const receiptNo = await getNextMaterialReceiptNo();
    res.json({ receiptNo });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate receipt number." });
  }
});

router.get("/material-payments", async (req, res) => {
  try {
    const payments = await listMaterialPayments();
    res.json({ payments });
  } catch (error) {
    res.status(500).json({ error: "Failed to load material payments." });
  }
});

router.post("/material-payments", async (req, res) => {
  const receiptNo = Number(req.body.receiptNo);
  const receiptDate = typeof req.body.receiptDate === "string" ? req.body.receiptDate.trim() : "";
  const partyId = Number(req.body.partyId);
  const amount = Number(req.body.amount);
  const transactionType = typeof req.body.transactionType === "string" ? req.body.transactionType.trim().toLowerCase() : "";
  const remarks = typeof req.body.remarks === "string" ? req.body.remarks.trim() : "";

  if (!receiptDate) {
    res.status(400).json({ error: "Receipt date is required." });
    return;
  }

  if (Number.isNaN(receiptNo) || receiptNo <= 0) {
    res.status(400).json({ error: "Receipt number must be a positive number." });
    return;
  }

  if (Number.isNaN(partyId) || partyId <= 0) {
    res.status(400).json({ error: "Party is required." });
    return;
  }

  if (Number.isNaN(amount)) {
    res.status(400).json({ error: "Amount must be a number." });
    return;
  }

  if (!transactionType || !["cash", "gpay", "cheque"].includes(transactionType)) {
    res.status(400).json({ error: "Transaction type is required." });
    return;
  }

  try {
    const payment = await insertMaterialPayment({
      receiptNo,
      receiptDate,
      partyId,
      amount,
      transactionType,
      remarks
    });
    const fullPayment = await getMaterialPaymentById(payment.id);
    res.status(201).json({ payment: fullPayment || payment });
  } catch (error) {
    if (error && error.message && error.message.includes("UNIQUE")) {
      res.status(409).json({ error: "Receipt number already exists." });
      return;
    }
    res.status(500).json({ error: "Failed to save material payment." });
  }
});

router.put("/material-payments/:id", async (req, res) => {
  const paymentId = Number(req.params.id);
  const receiptNo = Number(req.body.receiptNo);
  const receiptDate = typeof req.body.receiptDate === "string" ? req.body.receiptDate.trim() : "";
  const partyId = Number(req.body.partyId);
  const amount = Number(req.body.amount);
  const transactionType = typeof req.body.transactionType === "string" ? req.body.transactionType.trim().toLowerCase() : "";
  const remarks = typeof req.body.remarks === "string" ? req.body.remarks.trim() : "";

  if (Number.isNaN(paymentId) || paymentId <= 0) {
    res.status(400).json({ error: "Invalid payment id." });
    return;
  }

  if (!receiptDate) {
    res.status(400).json({ error: "Receipt date is required." });
    return;
  }

  if (Number.isNaN(receiptNo) || receiptNo <= 0) {
    res.status(400).json({ error: "Receipt number must be a positive number." });
    return;
  }

  if (Number.isNaN(partyId) || partyId <= 0) {
    res.status(400).json({ error: "Party is required." });
    return;
  }

  if (Number.isNaN(amount)) {
    res.status(400).json({ error: "Amount must be a number." });
    return;
  }

  if (!transactionType || !["cash", "gpay", "cheque"].includes(transactionType)) {
    res.status(400).json({ error: "Transaction type is required." });
    return;
  }

  try {
    const updated = await updateMaterialPayment(paymentId, {
      receiptNo,
      receiptDate,
      partyId,
      amount,
      transactionType,
      remarks
    });
    if (!updated) {
      res.status(404).json({ error: "Payment not found." });
      return;
    }
    const payment = await getMaterialPaymentById(paymentId);
    res.json({ payment });
  } catch (error) {
    if (error && error.message && error.message.includes("UNIQUE")) {
      res.status(409).json({ error: "Receipt number already exists." });
      return;
    }
    res.status(500).json({ error: "Failed to update material payment." });
  }
});

router.delete("/material-payments/:id", async (req, res) => {
  const paymentId = Number(req.params.id);
  if (Number.isNaN(paymentId) || paymentId <= 0) {
    res.status(400).json({ error: "Invalid payment id." });
    return;
  }

  try {
    const deleted = await deleteMaterialPayment(paymentId);
    if (!deleted) {
      res.status(404).json({ error: "Payment not found." });
      return;
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete material payment." });
  }
});

module.exports = router;
