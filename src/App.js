import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import SoundMeter from "./SoundMeter";

// Theme and image URLs
const theme = {
  orange: "#ff7000",
  white: "#fff",
  gray: "#f9f9fc",
  inputBorder: "#ffb066",
  buttonHover: "#ffa540"
};
const PROFILE_URL = "https://resume-worker.dan-creed.workers.dev/profile.jpg";
const GOON_URL = "https://images.credly.com/images/9a698c36-3b13-48b4-a3bf-8a070d5000a6/image.png";

function speak(text) {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1.06;
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  }
}

export default function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (voiceActive && !listening && transcript && transcript.trim()) {
      sendVoiceQuestion(transcript);
      resetTranscript();
      setQuestion("");
    }
    // eslint-disable-next-line
  }, [listening]);

  // Speak each answer out loud as it's set
  useEffect(() => {
    if (answer) speak(answer);
  }, [answer]);

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
      maxWidth: 700,
      margin: "3em auto",
      fontFamily: "sans-serif",
      background: theme.white,
      borderRadius: 16,
      boxShadow: "0 7px 32px rgba(255,112,0,0.11)",
      padding: "2em",
      border: `2.5px solid ${theme.orange}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      {/* Profile and Badge Row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "2em",
        marginBottom: "1em"
      }}>
        <img
          src={PROFILE_URL}
          alt="Daniel Creed Profile"
          style={{
            width: 90,
            height: 90,
            objectFit: "cover",
            borderRadius: "50%",
            border: `3px solid ${theme.orange}`,
            background: theme.white
          }}
        />
        <div>
          <h2 style={{
            color: theme.orange,
            fontWeight: "900",
            fontSize: "2em",
            marginBlock: 0,
          }}>
            {/* Updated Heading */}
            Daniel Creed Q&amp;A ChatBot
          </h2>
        </div>
        <img
          src={GOON_URL}
          alt="Goon Badge"
          style={{
            width: 65,
            height: 65,
            borderRadius: "10px",
            border: `2px solid ${theme.inputBorder}`,
            marginLeft: "1em"
          }}
        />
      </div>
      {/* --- Input and Voice --- */}
      <form onSubmit={handleAsk} style={{ margin: "2em 0 1.5em 0", width: "100%", display: "flex", gap: "1em", justifyContent: "center" }}>
        <input
          required
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask a question…"
          style={{
            flex: 1,
            padding: "0.9em",
            fontSize: "1.1em",
            border: `2.5px solid ${theme.inputBorder}`,
            borderRadius: 6,
            background: theme.white,
          }}
          disabled={loading || voiceActive}
        />
        <button
          type="submit"
          disabled={loading || voiceActive}
          style={{
            padding: "0.9em 1.5em",
            fontSize: "1.08em",
            background: theme.orange,
            color: theme.white,
            fontWeight: "bold",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "default" : "pointer",
            opacity: voiceActive ? 0.5 : 1,
          }}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      {browserSupportsSpeechRecognition && (
        <div style={{ marginBottom: "1em", width: "100%" }}>
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
                width: "100%"
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
                background: "#ffa540",
                color: theme.white,
                fontWeight: "bold",
                border: "none",
                borderRadius: 8,
                padding: "0.95em 1.6em",
                fontSize: "1.08em",
                margin: "0.2em auto",
                cursor: "pointer",
                width: "100%"
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
          margin: "1em 0",
          padding: "1em",
          background: theme.gray,
          fontSize: "1.15em",
          color: "#333",
          borderRadius: 14,
          border: `2px solid ${theme.inputBorder}`
        }}
      />
    </div>
  );
}
