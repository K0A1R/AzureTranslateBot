import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api"; // UPDATE TO AZURE URL WHEN DEPLOYED

function App() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/translate`, {
        text: inputText,
        targetLang: "fr", // default to French for now
      });
      setTranslatedText(response.data.message);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText("Error translating text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Azure TranslateBot</h1>
        <p>Text Translation + OCR coming soon</p>

        <div style={{ marginTop: "20px" }}>
          <textarea
            rows="4"
            cols="50"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to translate..."
            style={{ padding: "10px", fontSize: "16px" }}
          />
          <br />
          <button
            onClick={handleTranslate}
            disabled={loading}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              fontSize: "16px",
            }}
          >
            {loading ? "Translating..." : "Translate to French"}
          </button>
          {translatedText && (
            <div style={{ marginTop: "20px" }}>
              <h3>Translation:</h3>
              <p>{translatedText}</p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
