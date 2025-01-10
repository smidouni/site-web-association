const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { authenticateToken, authorizeRole } = require("../middlewares/auth");

// GET /api/users - Fetch all users (admin only)
router.get("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const [users] = await pool.query("SELECT id, username, role FROM users");
    res.json(users);
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs :", err.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

module.exports = router;
