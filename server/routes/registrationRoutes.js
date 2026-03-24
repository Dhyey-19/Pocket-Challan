const express = require("express");
const {
  calculateRegistrationKey,
  getRegistration,
  getOrCreateRegistration,
  getRegistrationForStatus,
  markRegistrationVerified
} = require("../repositories/registrationRepository");
const { getMachineHash } = require("../utils/machineFingerprint");

const router = express.Router();

router.get("/registration-status", async (req, res) => {
  try {
    const registration = await getRegistrationForStatus();
    const machineHash = getMachineHash();

    if (registration.verified && registration.machineHash && registration.machineHash !== machineHash) {
      res.json({
        verified: false,
        randomCode: "",
        machineMismatch: true
      });
      return;
    }

    res.json({
      verified: Boolean(registration.verified),
      randomCode: String(registration.randomCode || ""),
      machineMismatch: false
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load registration status." });
  }
});

router.post("/registration-verify", async (req, res) => {
  const inputValue = typeof req.body.key === "string" || typeof req.body.key === "number"
    ? String(req.body.key).trim()
    : "";

  if (!inputValue) {
    res.status(400).json({ error: "Registration key is required." });
    return;
  }

  const parsedKey = Number(inputValue);
  if (Number.isNaN(parsedKey)) {
    res.status(400).json({ error: "Registration key must be numeric." });
    return;
  }

  try {
    const registration = await getOrCreateRegistration();
    const machineHash = getMachineHash();

    if (registration.verified && registration.machineHash && registration.machineHash !== machineHash) {
      res.status(403).json({ error: "Registration is locked to another machine." });
      return;
    }

    const expectedKey = calculateRegistrationKey(registration.randomCode);

    if (parsedKey !== expectedKey) {
      res.status(400).json({ error: "Invalid registration key." });
      return;
    }

    await markRegistrationVerified(registration.id, machineHash);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to verify registration key." });
  }
});

module.exports = router;
