const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/api/test", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Translator route - REPLACE with actual translation implementation (AMRIT)
app.post("/api/translate", (req, res) => {
  res.json({ success: true, message: "Test Translator API" });
});

// OCR route - REPLACE with actual OCR implementation (PETER)
app.post("/api/ocr", (req, res) => {
  res.json({ success: true, message: "Test OCR API" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
