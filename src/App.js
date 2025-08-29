// src/App.js

import React, { useState } from "react";

function App() {
  const [uploadText, setUploadText] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function uploadResume() {
    await fetch("/resume", { method: "PUT", body: uploadText });
    alert("Resume uploaded!");
  }

  async function askQuestion() {
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
      <h2>Resume Uploader</h2>
      <textarea
        rows={8}
        value={uploadText}
        onChange={e => setUploadText(e.target.value)}
        placeholder="Paste resume text here"
        style={{ width: "100%" }}
      />
      <br />
      <button onClick={uploadResume}>Upload Resume</button>
      <hr />
      <h2>Ask a Question</h2>
      <input
        type="text"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Ask about your resume"
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
