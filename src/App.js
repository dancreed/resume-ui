import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import SoundMeter from "./SoundMeter";

const theme = {
  orange: "#ff7000",
  white: "#fff",
  gray: "#f9f9fc",
  inputBorder: "#ffb066",
  buttonHover: "#ffa540"
};

export default function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Personal assistant mode: auto-ask & answer
  useEffect(() => {
    if (voiceActive && !listening && transcript && transcript.trim()) {
      sendVoiceQuestion(transcript);
      resetTranscript();
      setQuestion("");
    }
    // eslint-disable-next-line
  }, [listening]);

  const handleStartVoice = () => {
    setVoiceActive(true);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: "en-US" });
  };

  const handleStopVoice = () => {
    setVoiceActive(false);
    SpeechRecognition.stopListening();
  };

  async function sendVoiceQuestion(speechText) {
    setAnswer("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: speechText }),
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.text();
      setAnswer(result || "No answer returned.");
    } catch (err) {
      setError("Sorry, something went wrong. " + (err.message || err));
    } finally {
      setLoading(false);
      // Auto-continue listening if in "assistant" mode
      if (voiceActive) {
        setTimeout(() => {
          resetTranscript();
          SpeechRecognition.startListening({ continuous: false, language: "en-US" });
        }, 500);
      }
    }
  }

  const handleAsk = async (e) => {
    e.preventDefault();
    setAnswer("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.text();
      setAnswer(result || "No answer returned.");
    } catch (err) {
      setError("Sorry, something went wrong. " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 630,
      margin: "3em auto",
      fontFamily: "sans-serif",
      background: theme.white,
      borderRadius: 14,
      boxShadow: "0 6px 24px rgba(255,112,0,0.08)",
      padding: "2.3em 1.5em",
      border: `2.5px solid ${theme.orange}`,
    }}>
      <h2 style={{
        color: theme.orange,
        fontWeight: "900",
        fontSize: "2.2em",
        marginBottom: "0.5em",
      }}>
        Daniel Creed Resume Q&amp;A
      </h2>
      <form onSubmit={handleAsk} style={{ margin: "2em 0 1em 0" }}>
        <input
          required
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask a question…"
          style={{
            width: "63%",
            padding: "0.9em",
            fontSize: "1.1em",
            border: `2.5px solid ${theme.inputBorder}`,
            borderRadius: 6,
            marginRight: "1em",
            background: theme.white,
          }}
          disabled={loading || voiceActive}
        />
        <button
          type="submit"
          disabled={loading || voiceActive}
          style={{
            padding: "0.9em 1.5em",
            fontSize: "1.1em",
            background: theme.orange,
            color: theme.white,
            fontWeight: "bold",
            border: "none",
            borderRadius: 6,
            transition: "background 0.2s",
            cursor: loading ? "default" : "pointer",
            opacity: voiceActive ? 0.5 : 1,
          }}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      {browserSupportsSpeechRecognition && (
        <div style={{ marginBottom: "1em" }}>
          {!voiceActive ? (
            <button
              type="button"
              style={{
                background: theme.orange,
                color: theme.white,
                fontWeight: "bold",
                border: "none",
                borderRadius: 8,
                padding: "0.95em 1.6em",
                fontSize: "1.08em",
                margin: "0.2em auto",
                cursor: "pointer",
                boxShadow: listening ? `0 0 14px 2px ${theme.orange}` : undefined,
                transition: "box-shadow 0.2s",
              }}
              onClick={handleStartVoice}
              disabled={loading}
            >
              🎤 Start Conversation
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopVoice}
              style={{
                background: theme.orange,
                color: theme.white,
                fontWeight: "bold",
                border: "none",
                borderRadius: 8,
                padding: "0.95em 1.6em",
                fontSize: "1.08em",
                margin: "0.2em auto",
                cursor: "pointer",
                boxShadow: "0 0 14px 2px #ffa540",
                transition: "box-shadow 0.2s",
              }}
              disabled={loading}
            >
              ⏹ Stop Conversation
            </button>
          )}
          {voiceActive && <SoundMeter listening={listening} />}
          {voiceActive && (
            <div style={{ color: theme.orange, marginTop: "0.5em", fontWeight: 700 }}>
              {listening ? "Listening…" : transcript ? "Recognized: " + transcript : ""}
            </div>
          )}
        </div>
      )}
      {!browserSupportsSpeechRecognition &&
        <div style={{ color: "#cc3333", marginBottom: "1em" }}>
          Voice recognition not supported in this browser.
        </div>
      }
      {error && <div style={{ color: "#cc3333", marginBottom: "1em" }}>{error}</div>}
      <textarea
        readOnly
        value={answer}
        placeholder="The AI's answer will appear here…"
        style={{
          width: "100%",
          minHeight: 100,
          margin: "1.2em 0",
          padding: "1.1em",
          background: theme.gray,
          fontSize: "1.15em",
          color: "#333",
          borderRadius: 12,
          border: `2.5px solid ${theme.inputBorder}`,
        }}
      />
    </div>
  );
}
