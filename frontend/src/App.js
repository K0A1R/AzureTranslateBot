import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api"; // UPDATE TO AZURE URL WHEN DEPLOYED

function App() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("fr"); // Default language French
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to translate");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/translate`, {
        text: inputText,
        targetLang: targetLanguage,
      });

      if (response.data.success) {
        setTranslatedText(response.data.translatedText);
      } else {
        setError(response.data.error || "Translation failed");
      }
    } catch (error) {
      console.error("Translation error:", error);
      setError("Failed to connect to translation service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Azure TranslateBot</h1>
        <p>Powered by Azure Translator API</p>

        <div style={{ marginTop: "20px" }}>
          {/* Language selector */}
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="language">Translate to: </label>
            <select
              id="language"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              style={{ marginLeft: "10px", padding: "5px" }}
            >
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="zh-Hans">Chinese (Simplified)</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="hi">Hindi</option>
            </select>
          </div>

          {/* Text input */}
          <textarea
            rows="4"
            cols="50"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to translate..."
            style={{ padding: "10px", fontSize: "16px" }}
          />
          <br />

          {/* Translate button */}
          <button
            onClick={handleTranslate}
            disabled={loading}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              fontSize: "16px",
            }}
          >
            {loading ? "Translating..." : "Translate"}
          </button>

          {/* Error message */}
          {error && (
            <div style={{ marginTop: "20px", color: "red" }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Translation result */}
          {translatedText && !error && (
            <div
              style={{
                marginTop: "20px",
                maxWidth: "500px",
                textAlign: "left",
              }}
            >
              <h3>Translation:</h3>
              <p
                style={{
                  backgroundColor: "#f0f0f0",
                  padding: "15px",
                  borderRadius: "5px",
                  color: "#333",
                }}
              >
                {translatedText}
              </p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
