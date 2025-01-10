// backend/routes/news.js

const express = require("express");
const { getAllNews, createNews } = require("../controllers/news");
const { authenticateToken, authorizeRole } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimeType && extName) {
    return cb(null, true);
  }
  cb(new Error("Only image files are allowed (jpeg, jpg, png, gif)"));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Routes
router.get("/", getAllNews); // Fetch all news

// Use multer middleware for handling single image upload with field name 'image'
router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  upload.single("image"),
  createNews
); // Admin crée une actualité

module.exports = router;
