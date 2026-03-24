const express = require("express");
const {
  getUserByUsername,
  insertUser,
  updateUserPassword
} = require("../repositories/userRepository");
const { getRegistration, markRegistrationVerified } = require("../repositories/registrationRepository");
const { getMachineHash } = require("../utils/machineFingerprint");

const router = express.Router();

function getCurrentUser(req) {
  const value = typeof req.headers["x-auth-user"] === "string" ? req.headers["x-auth-user"].trim() : "";
  return value;
}

router.post("/auth/login", async (req, res) => {
  const username = typeof req.body.username === "string" ? req.body.username.trim() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required." });
    return;
  }

  try {
    const registration = await getRegistration();
    if (!registration || !registration.verified) {
      res.status(403).json({ error: "App registration required." });
      return;
    }

    const machineHash = getMachineHash();
    if (!registration.machineHash) {
      await markRegistrationVerified(registration.id, machineHash);
    }

    if (registration.machineHash && registration.machineHash !== machineHash) {
      res.status(403).json({ error: "Registration is tied to another machine." });
      return;
    }

    const user = await getUserByUsername(username);
    if (!user || String(user.password) !== password) {
      res.status(401).json({ error: "Invalid username or password." });
      return;
    }

    res.json({
      user: {
        username: user.username,
        isAdmin: user.username === "admin"
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to login." });
  }
});

router.post("/users", async (req, res) => {
  const currentUser = getCurrentUser(req);
  if (currentUser !== "admin") {
    res.status(403).json({ error: "Only admin can manage users." });
    return;
  }

  const username = typeof req.body.username === "string" ? req.body.username.trim() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required." });
    return;
  }

  if (username.toLowerCase() === "admin") {
    res.status(400).json({ error: "Admin username already exists and cannot be recreated." });
    return;
  }

  try {
    const existing = await getUserByUsername(username);
    if (existing) {
      res.status(409).json({ error: "Username already exists." });
      return;
    }

    const user = await insertUser(username, password);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user." });
  }
});

router.put("/users/admin-password", async (req, res) => {
  const currentUser = getCurrentUser(req);
  if (currentUser !== "admin") {
    res.status(403).json({ error: "Only admin can change admin password." });
    return;
  }

  const password = typeof req.body.password === "string" ? req.body.password : "";
  if (!password) {
    res.status(400).json({ error: "New password is required." });
    return;
  }

  try {
    const changes = await updateUserPassword("admin", password);
    if (!changes) {
      res.status(404).json({ error: "Admin user not found." });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update admin password." });
  }
});

module.exports = router;
