// backend/app.js

const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path"); // Added for static files
const userRoutes = require("./routes/users");
const newsRoutes = require("./routes/news");
const commentRoutes = require("./routes/comments");
const voteRoutes = require("./routes/votes");

dotenv.config();

const app = express();

// Middleware de sécurité
app.use(helmet());

// Configuration de CORS
app.use(
  cors({
    origin: "http://localhost:8080", // Remplacez par l'URL de votre frontend en production
    credentials: true,
  })
);

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Serve static files from 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/votes", voteRoutes);

// Gestion des routes non définies
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

// Serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
);
