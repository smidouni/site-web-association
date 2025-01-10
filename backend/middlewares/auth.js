// backend/middlewares/auth.js

const pool = require("../config/db");

// Middleware pour authentifier le token
const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Accès refusé. Token manquant." });

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE token = ?", [
      token,
    ]);

    if (rows.length === 0)
      return res.status(401).json({ message: "Token invalide." });

    req.user = rows[0];
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware pour autoriser les rôles spécifiques
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Accès interdit. Rôle insuffisant." });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
