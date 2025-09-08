// backend/server.js
const express = require("express");
const cors = require("cors");
const { initDB } = require("./db");
const resumeRoutes = require("./routes/resumeRoutes");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/resumes", resumeRoutes);

const PORT = process.env.PORT || 5000;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error initializing database:", err);
  });
