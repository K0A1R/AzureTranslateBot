import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const [translatedText, setTranslatedText] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const API_BASE_URL = "";

  const handleTranslate = async () => {
    if (!text.trim()) {
      alert("Please enter text to translate.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("Translating...");
      setExtractedText("");
      setTranslatedText("");

      const response = await axios.post(
        `${API_BASE_URL}/api/translate`,
        {
          text,
          targetLang,
        },
        {
          timeout: 15000,
        },
      );

      const result = response.data.translatedText || "";

      if (!result) {
        setStatusMessage(
          "Request completed, but no translated text was returned.",
        );
        return;
      }

      setTranslatedText(result);
      setStatusMessage("Translation completed.");
    } catch (error) {
      console.error("Translate error:", error);
      console.error("Response data:", error.response?.data);
      const message =
        error.response?.data?.error || error.message || "Translation failed.";
      setStatusMessage(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOCRTranslate = async () => {
    if (!selectedFile) {
      alert("Please choose an image first.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("Processing OCR...");
      setExtractedText("");
      setTranslatedText("");

      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("targetLang", targetLang);

      const response = await axios.post(`${API_BASE_URL}/api/ocr`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 15000,
      });

      setExtractedText(response.data.extractedText || "");
      setTranslatedText(response.data.translatedText || "");
      setStatusMessage("OCR request completed.");
    } catch (error) {
      console.error("OCR error:", error);
      console.error("Response data:", error.response?.data);
      const message =
        error.response?.data?.error ||
        error.message ||
        "OCR translation failed.";
      setStatusMessage(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Azure TranslateBot</h1>

      <div className="card">
        <h2>Text Translation</h2>

        <textarea
          rows="5"
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label>Select Target Language</label>
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
        >
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ar">Arabic</option>
          <option value="ur">Urdu</option>
          <option value="ja">Japanese</option>
        </select>

        <button onClick={handleTranslate} disabled={loading}>
          {loading ? "Processing..." : "Translate Text"}
        </button>

        {statusMessage && <p className="status-message">{statusMessage}</p>}

        {translatedText && (
          <div className="result-card inline-result">
            <h3>Translated Text</h3>
            <p>{translatedText}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2>OCR Translation</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        <button onClick={handleOCRTranslate} disabled={loading}>
          {loading ? "Processing..." : "Upload Image and Translate"}
        </button>

        {extractedText && (
          <div className="result-card inline-result">
            <h3>Extracted Text</h3>
            <p>{extractedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
