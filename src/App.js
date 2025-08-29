import React, { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async (e) => {
    e.preventDefault(); // Prevents page reload!
    setAnswer("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) {
        const errTxt = await res.text();
        throw new Error("Server error: " + errTxt);
      }
      const data = await res.json();
      setAnswer(data.answer || "(No answer returned)");
    } catch (err) {
      setError("Sorry, something went wrong. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 650, margin: "3em auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <h2>Daniel Creed Resume Q&amp;A</h2>
      <form onSubmit={handleAsk} style={{ margin: "2em 0" }}>
        <input
          required
          placeholder="Ask about Daniel Creed..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          style={{
            width: "65%", padding: "0.75em", fontSize: "1.1em",
            border: "1px solid #ccc", borderRadius: 4
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: "1em", padding: "0.8em 1.2em", fontSize: "1em",
            background: "#0052cc", color: "white", border: "none", borderRadius: "4px"
          }}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      {error && (
        <div style={{ color: "crimson", marginBottom: "1em", fontWeight: "bold" }}>
          {error}
        </div>
      )}
      {answer && (
        <div style={{
          background: "#f8f8ff",
          fontSize: "1.1em",
          padding: "1.3em",
          borderRadius: 8,
          border: "1px solid #eaeaea",
          margin: "1.5em auto",
          maxWidth: "90%",
          minHeight: "3em",
        }}>
          <b>Answer:</b>
          <div style={{ marginTop: "0.7em", whiteSpace: "pre-wrap" }}>{answer}</div>
        </div>
      )}
    </main>
  );
}

export default App;
