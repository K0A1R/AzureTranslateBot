const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const TextTranslationClient =
  require("@azure-rest/ai-translation-text").default;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLang, sourceLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: text and targetLang",
      });
    }

    const translateCredential = {
      key: process.env.AZURE_TRANSLATOR_KEY,
      region: process.env.AZURE_TRANSLATOR_REGION,
    };

    const translationClient = new TextTranslationClient(
      process.env.AZURE_TRANSLATOR_ENDPOINT,
      translateCredential,
    );

    const inputText = [{ text }];
    const queryParams = { to: targetLang };

    if (sourceLang) {
      queryParams.from = sourceLang;
    }

    const translateResponse = await translationClient.path("/translate").post({
      body: inputText,
      queryParameters: queryParams,
    });

    const translations = translateResponse.body;
    let translatedText = "";

    if (translations && translations[0] && translations[0].translations[0]) {
      translatedText = translations[0].translations[0].text;
    }

    if (!translatedText) {
      return res.status(500).json({
        success: false,
        error: "Translation service returned no translated text.",
      });
    }

    res.json({
      success: true,
      originalText: text,
      translatedText,
      sourceLanguage: sourceLang || "auto-detected",
      targetLanguage: targetLang,
    });
  } catch (error) {
    console.error(
      "Translation error:",
      error.response?.body || error.response?.data || error.message || error,
    );
    res.status(500).json({
      success: false,
      error: "Translation failed. Please try again.",
    });
  }
});

app.post("/api/ocr", (req, res) => {
  res.status(501).json({
    success: false,
    error: "OCR route not ready yet.",
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
