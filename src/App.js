import React, { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function askQuestion() {
    setAnswer(""); // clear previous
    const res = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
  }

  return (
    <div style={{ maxWidth: 550, margin: "0 auto", padding: "2em" }}>
      <h2>Ask a Question About Your Resume</h2>
      <input
        type="text"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Type a question"
        style={{ width: "100%" }}
      />
      <br />
      <button onClick={askQuestion}>Ask</button>
      {answer && (
        <div>
          <h3>AI Answer:</h3>
          <pre>{answer}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
