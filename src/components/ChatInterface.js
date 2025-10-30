import React from "react";
import styles from "../styles/ChatInterface.module.css";

export default function ChatInterface({ 
  question, 
  setQuestion, 
  handleAsk, 
  loading, 
  voiceActive, 
  answer, 
  error 
}) {
  return (
    <>
      <form onSubmit={handleAsk} className={styles.form}>
        <input
          required
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask a question…"
          className={styles.input}
          disabled={loading || voiceActive}
          aria-label="Question input"
        />
        <button
          type="submit"
          disabled={loading || voiceActive}
          className={styles.button}
          aria-label="Submit question"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
      
      <textarea
        readOnly
        value={answer}
        placeholder="The AI's answer will appear here…"
        className={styles.textarea}
        aria-label="AI response"
      />
    </>
  );
}
