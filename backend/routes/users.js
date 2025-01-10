// backend/routes/users.js

const express = require("express");
const { authenticateToken, authorizeRole } = require("../middlewares/auth");
const {
  loginUser,
  deleteUser,
  getAllUsers,
  createUser,
  updateUser,
} = require("../controllers/users");

const router = express.Router();

// Connexion de l'utilisateur
router.post("/login", loginUser);

// Récupérer tous les utilisateurs (admin uniquement)
router.get("/", authenticateToken, authorizeRole("admin"), getAllUsers);

// Créer un nouvel utilisateur (admin uniquement)
router.post("/", authenticateToken, authorizeRole("admin"), createUser);

// Mettre à jour un utilisateur par ID (admin uniquement)
router.put("/:id", authenticateToken, authorizeRole("admin"), updateUser);

// Supprimer un utilisateur par ID (admin uniquement)
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteUser);

module.exports = router;
