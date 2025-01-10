// backend/controllers/users.js

const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const bcrypt = require("bcrypt");

// User login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (rows.length === 0)
      return res.status(404).json({ message: "Utilisateur non trouvé." });

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "Identifiants invalides." });

    // Génération ou récupération du token permanent
    let token = user.token;
    if (!token) {
      token = uuidv4(); // Générer un nouveau token s'il n'existe pas
      await pool.query("UPDATE users SET token = ? WHERE id = ?", [
        token,
        user.id,
      ]);
    }

    res.status(200).json({
      message: "Connexion réussie.",
      token,
      role: user.role,
      userId: user.id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware d'authentification basé sur le token
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

// Suppression d'un utilisateur par ID
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await pool.query("DELETE FROM users WHERE id = ?", [userId]);
    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer tous les utilisateurs (admin uniquement)
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, role, created_at FROM users"
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer un nouvel utilisateur (admin uniquement)
const createUser = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Nom d'utilisateur et mot de passe requis." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Niveau de salage 10

    const [result] = await pool.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role || "user"]
    );

    res
      .status(201)
      .json({
        message: "Utilisateur créé avec succès.",
        userId: result.insertId,
      });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ message: "Le nom d'utilisateur est déjà pris." });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Mettre à jour un utilisateur par ID (admin uniquement)
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, role, password } = req.body;

  if (!username && !role && !password) {
    return res.status(400).json({
      message: "Au moins un champ doit être fourni pour la mise à jour.",
    });
  }

  let updateFields = [];
  let values = [];

  if (username) {
    updateFields.push("username = ?");
    values.push(username);
  }
  if (role) {
    updateFields.push("role = ?");
    values.push(role);
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateFields.push("password = ?");
    values.push(hashedPassword);
  }

  values.push(userId);

  try {
    const [result] = await pool.query(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json({ message: "Utilisateur mis à jour avec succès." });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ message: "Le nom d'utilisateur est déjà pris." });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = {
  loginUser,
  authenticateToken,
  deleteUser,
  getAllUsers,
  createUser,
  updateUser,
};
