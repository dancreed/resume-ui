import React, { useState } from "react";

export default function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      // Read answer as simple text (no JSON parsing)
      const result = await res.text();
      setAnswer(result || "No answer returned.");
    } catch (err) {
      setError("Sorry, something went wrong. " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "3em auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <h2>Daniel Creed Resume Q&amp;A</h2>
      <form onSubmit={handleAsk} style={{ margin: "2em 0" }}>
        <input
          required
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask about Daniel Creed's experience, skills, etc."
          style={{
            width: "65%",
            padding: "0.75em",
            fontSize: "1.1em",
            border: "1px solid #aaa",
            borderRadius: 4
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginLeft: "1em",
            padding: "0.8em 1.2em",
            fontSize: "1em",
            background: "#0052cc",
            color: "white",
            border: "none",
            borderRadius: "4px"
          }}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      {error && <div style={{ color: "crimson", marginBottom: "1em" }}>{error}</div>}
      <textarea
        readOnly
        value={answer}
        placeholder="The AI's answer will appear here…"
        style={{
          width: "95%",
          minHeight: 100,
          margin: "2em 0",
          padding: "1em",
          background: "#f9f9fc",
          fontSize: "1.05em",
          borderRadius: 8,
          border: "1.5px solid #e5e5e5"
        }}
      />
    </div>
  );
}
