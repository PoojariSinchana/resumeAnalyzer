// backend/routes/resumeRoutes.js
const express = require("express");
const multer = require("multer");
const { getDB } = require("../db");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Upload Resume API
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // ⚡ Normally you would parse the resume and call AI here.
    // For now, insert dummy data into DB:
    const db = getDB();
    const [result] = await db.execute(
      `INSERT INTO resumes (file_name, name, email, phone, summary, technical_skills, soft_skills, resume_rating, improvement_areas, upskill_suggestions) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        file.originalname,
        "John Doe",
        "johndoe@example.com",
        "1234567890",
        "Software Engineer with 3 years of experience.",
        JSON.stringify(["JavaScript", "React", "Node.js"]),
        JSON.stringify(["Teamwork", "Communication"]),
        7,
        "Improve project description clarity.",
        JSON.stringify(["Docker", "AWS"]),
      ]
    );

    res.json({ message: "Resume uploaded & analyzed", resumeId: result.insertId });
  } catch (err) {
    console.error("❌ Error uploading resume:", err);
    res.status(500).json({ error: "Failed to upload resume" });
  }
});

// Get All Resumes API
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.query("SELECT id, file_name, name, email, uploaded_at FROM resumes ORDER BY uploaded_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching resumes:", err);
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});

// Get Resume Details by ID API
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.query("SELECT * FROM resumes WHERE id = ?", [req.params.id]);

    if (rows.length === 0) return res.status(404).json({ error: "Resume not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching resume details:", err);
    res.status(500).json({ error: "Failed to fetch resume details" });
  }
});

module.exports = router;
