import React, { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

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
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Submit from typed input or from voice transcript
  async function handleAsk(e) {
    e.preventDefault();
    setAnswer("");
    setError("");
    setLoading(true);
    const query = question.trim() || transcript.trim();

    try {
      const res = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.text();
      setAnswer(result || "No answer returned.");
    } catch (err) {
      setError("Sorry, something went wrong. " + (err.message || err));
    } finally {
      setLoading(false);
      resetTranscript();
    }
  }

  // When using voice, submit automatically at stop
  React.useEffect(() => {
    if (!listening && transcript && transcript.trim()) {
      setQuestion(transcript);
    }
  }, [listening, transcript]);

  return (
    <div style={{
      maxWidth: 600,
      margin: "3em auto",
      fontFamily: "sans-serif",
      background: theme.white,
      borderRadius: 12,
      boxShadow: "0 6px 24px rgba(255,112,0,0.09)",
      padding: "2em 2em 2em 2em",
      border: `1px solid ${theme.orange}`,
    }}>
      <h2 style={{
        color: theme.orange,
        fontWeight: "900",
        fontSize: "2.1em",
        marginBottom: "0.5em",
      }}>
        Daniel Creed Resume Q&amp;A
      </h2>
      <form onSubmit={handleAsk} style={{ margin: "2em 0" }}>
        <input
          required
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask Daniel Creed a question..."
          style={{
            width: "65%",
            padding: "0.9em",
            fontSize: "1.1em",
            border: `2.5px solid ${theme.inputBorder}`,
            borderRadius: 6,
            marginRight: "1em",
            background: theme.white,
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.9em 1.5em",
            fontSize: "1.1em",
            background: theme.orange,
            color: theme.white,
            fontWeight: "bold",
            border: "none",
            borderRadius: 6,
            transition: "background 0.2s",
            cursor: loading ? "default" : "pointer"
          }}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      {browserSupportsSpeechRecognition && (
        <div style={{ marginBottom: "1em" }}>
          <button
            type="button"
            style={{
              background: listening ? theme.buttonHover : theme.orange,
              color: theme.white,
              fontWeight: "bold",
              border: "none",
              borderRadius: 6,
              padding: "0.75em 1.1em",
              marginRight: "0.5em",
              cursor: "pointer"
            }}
            onClick={() => {
              resetTranscript();
              SpeechRecognition.startListening({ continuous: false });
            }}
            disabled={loading}
          >
            🎤 {listening ? "Listening..." : "Use Voice"}
          </button>
          {transcript && !listening && (
            <button
              type="button"
              onClick={handleAsk}
              style={{
                background: theme.orange,
                color: theme.white,
                border: "none",
                borderRadius: "6px",
                padding: "0.6em 1.1em",
                marginLeft: "0.5em",
                cursor: loading ? "default" : "pointer"
              }}
              disabled={loading}
            >
              Ask with Voice
            </button>
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
          border: `2px solid ${theme.inputBorder}`,
        }}
      />
    </div>
  );
}
