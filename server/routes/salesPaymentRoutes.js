const express = require("express");
const {
  getNextReceiptNo,
  insertSalesPayment,
  listSalesPayments,
  getSalesPaymentById,
  updateSalesPayment,
  deleteSalesPayment
} = require("../repositories/salesPaymentRepository");

const router = express.Router();

router.get("/sales-payments/next-receipt", async (req, res) => {
  try {
    const receiptNo = await getNextReceiptNo();
    res.json({ receiptNo });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate receipt number." });
  }
});

router.get("/sales-payments", async (req, res) => {
  try {
    const payments = await listSalesPayments();
    res.json({ payments });
  } catch (error) {
    res.status(500).json({ error: "Failed to load sales payments." });
  }
});

router.post("/sales-payments", async (req, res) => {
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
    const payment = await insertSalesPayment({
      receiptNo,
      receiptDate,
      partyId,
      amount,
      transactionType,
      remarks
    });
    const fullPayment = await getSalesPaymentById(payment.id);
    res.status(201).json({ payment: fullPayment || payment });
  } catch (error) {
    if (error && error.message && error.message.includes("UNIQUE")) {
      res.status(409).json({ error: "Receipt number already exists." });
      return;
    }
    res.status(500).json({ error: "Failed to save sales payment." });
  }
});

router.put("/sales-payments/:id", async (req, res) => {
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
    const updated = await updateSalesPayment(paymentId, {
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
    const payment = await getSalesPaymentById(paymentId);
    res.json({ payment });
  } catch (error) {
    if (error && error.message && error.message.includes("UNIQUE")) {
      res.status(409).json({ error: "Receipt number already exists." });
      return;
    }
    res.status(500).json({ error: "Failed to update sales payment." });
  }
});

router.delete("/sales-payments/:id", async (req, res) => {
  const paymentId = Number(req.params.id);
  if (Number.isNaN(paymentId) || paymentId <= 0) {
    res.status(400).json({ error: "Invalid payment id." });
    return;
  }

  try {
    const deleted = await deleteSalesPayment(paymentId);
    if (!deleted) {
      res.status(404).json({ error: "Payment not found." });
      return;
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete sales payment." });
  }
});

module.exports = router;
