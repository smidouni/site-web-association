// backend/controllers/news.js

const pool = require("../config/db");
const path = require("path");

// Fetch all news
const getAllNews = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM news ORDER BY created_at DESC"
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a news
const createNews = async (req, res) => {
  const { title, content } = req.body;
  let image_url = null;

  if (req.file) {
    // Construct the URL to access the uploaded image
    image_url = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
  }

  if (!title || !content) {
    return res.status(400).json({ message: "Titre et contenu requis." });
  }

  try {
    await pool.query(
      "INSERT INTO news (title, content, image_url) VALUES (?, ?, ?)",
      [title, content, image_url]
    );
    res.status(201).json({ message: "Actualité créée avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllNews, createNews };
