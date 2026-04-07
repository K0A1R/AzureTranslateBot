const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const TextTranslationClient =
  require("@azure-rest/ai-translation-text").default;

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

// Translator route (AMRIT)
app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLang, sourceLang } = req.body;

    // Validate input
    if (!text || !targetLang) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: text and targetLang",
      });
    }

    // Set up Azure Translator credentials
    const translateCredential = {
      key: process.env.AZURE_TRANSLATOR_KEY,
      region: process.env.AZURE_TRANSLATOR_REGION,
    };

    const translationClient = new TextTranslationClient(
      process.env.AZURE_TRANSLATOR_ENDPOINT,
      translateCredential,
    );

    // Prepare translation request
    const inputText = [{ text: text }];
    const queryParams = {
      to: targetLang,
    };

    // Add source language if provided
    if (sourceLang) {
      queryParams.from = sourceLang;
    }

    const translateResponse = await translationClient.path("/translate").post({
      body: inputText,
      queryParameters: queryParams,
    });

    // Extract translated text from response
    const translations = translateResponse.body;
    let translatedText = "";

    if (translations && translations[0] && translations[0].translations[0]) {
      translatedText = translations[0].translations[0].text;
    }

    res.json({
      success: true,
      originalText: text,
      translatedText: translatedText,
      sourceLanguage: sourceLang || "auto-detected",
      targetLanguage: targetLang,
    });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({
      success: false,
      error: "Translation failed. Please try again.",
    });
  }
});

// OCR route - REPLACE with actual OCR implementation (PETER)
app.post("/api/ocr", (req, res) => {
  res.json({ success: true, message: "Test OCR API" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
