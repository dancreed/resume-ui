import React, { useState, useRef } from "react";

const WS_URL = "wss://worker.dan-creed.workers.dev/websocket";  // <-- Replace if needed

export default function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const micStreamRef = useRef(null);

  // Text Q&A
  async function handleAsk(e) {
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
      setError("Sorry, something went wrong. " + ((err && err.message) || err));
    } finally {
      setLoading(false);
    }
  }

  // VOICE - CONNECT
  function connectVoiceWS() {
    wsRef.current = new window.WebSocket(WS_URL);
    wsRef.current.onopen = () => setWsConnected(true);
    wsRef.current.onmessage = async (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.type === "text") {
        setAnswer(msg.text); // Show in output box
      } else if (msg.type === "audio") {
        playBase64Audio(msg.audio);
      }
    };
    wsRef.current.onclose = () => setWsConnected(false);
  }

  // Play backend base64 audio
  function playBase64Audio(b64) {
    const audioBlob = new window.Blob(
      [Uint8Array.from(window.atob(b64), c => c.charCodeAt(0))],
      { type: "audio/wav" }
    );
    const url = window.URL.createObjectURL(audioBlob);
    const audio = new window.Audio(url);
    audio.play();
  }

  // VOICE - START
  async function startVoiceRecording() {
    if (!wsConnected || !wsRef.current) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Microphone not supported!");
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micStreamRef.current = stream;
    const recorder = new window.MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = async (e) => {
      if (e.data && wsRef.current?.readyState === window.WebSocket.OPEN) {
        const buffer = await e.data.arrayBuffer();
        wsRef.current.send(buffer);
      }
    };
    recorder.start(500);
  }

  // VOICE - STOP (stop recorder + stop ALL mic tracks)
  function stopVoiceRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
  }

  return (
    <div style={{ maxWidth: 620, margin: "3em auto", background: "#fff", borderRadius: 16, padding: "2em", boxShadow: "0 7px 32px rgba(255,112,0,0.11)", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#ff7000", margin: "0 0 1em 0", textAlign: "center" }}>Daniel Creed Q&amp;A ChatBot</h1>
      <form onSubmit={handleAsk} style={{ display: "flex", gap: "1em", marginBottom: "1em" }}>
        <input
          required
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask a question…"
          style={{ flex: 1, padding: "1em", borderRadius: "7px", border: "2px solid #ffb066", fontSize: "1.08em" }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#ff7000",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: "7px",
            padding: "0 1.1em",
            fontSize: "1.08em",
            cursor: loading ? "default" : "pointer"
          }}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      <div style={{ display: "flex", gap: "1em", marginBottom: "1em", justifyContent: "center" }}>
        <button
          onClick={connectVoiceWS}
          disabled={wsConnected}
          style={{
            padding: "10px 24px",
            borderRadius: "8px",
            background: wsConnected ? "gray" : "#ff7000",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            cursor: wsConnected ? "default" : "pointer"
          }}
        >
          {wsConnected ? "Voice Connected" : "Connect Voice"}
        </button>
        <button
          onClick={startVoiceRecording}
          disabled={!wsConnected || !!mediaRecorderRef.current}
          style={{
            padding: "10px 24px",
            borderRadius: "8px",
            background: "orange",
            color: "#222",
            fontWeight: "bold",
            border: "none",
            cursor: !wsConnected || !!mediaRecorderRef.current ? "default" : "pointer"
          }}
        >
          🎤 Start Voice
        </button>
        <button
          onClick={stopVoiceRecording}
          disabled={!mediaRecorderRef.current}
          style={{
            padding: "10px 24px",
            borderRadius: "8px",
            background: "red",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            cursor: !mediaRecorderRef.current ? "default" : "pointer"
          }}
        >
          ⏹ Stop Voice
        </button>
      </div>
      <div>
        <textarea
          readOnly
          value={answer}
          placeholder="AI's answer will appear here…"
          style={{
            width: "100%",
            minHeight: 90,
            marginBottom: "1em",
            padding: "1em",
            background: "#f9f9fc",
            fontSize: "1.12em",
            borderRadius: "12px",
            border: "1.5px solid #ffb066"
          }}
        />
      </div>
      {error && <div style={{ color: "#cc3333", marginBottom: "1em" }}>{error}</div>}
    </div>
  );
}
