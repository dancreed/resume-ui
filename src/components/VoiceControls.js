import React from "react";
import SpeechRecognition from "react-speech-recognition";
import SoundMeter from "../SoundMeter";
import styles from "../styles/VoiceControls.module.css";

export default function VoiceControls({ 
  voiceActive, 
  setVoiceActive, 
  listening, 
  transcript, 
  resetTranscript, 
  browserSupportsSpeechRecognition,
  loading 
}) {
  const handleStartVoice = () => {
    setVoiceActive(true);
    resetTranscript();
    SpeechRecognition.startListening({ 
      continuous: false, 
      language: process.env.REACT_APP_SPEECH_LANGUAGE || "en-US" 
    });
  };

  const handleStopVoice = () => {
    setVoiceActive(false);
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className={styles.error}>
        Voice recognition not supported in this browser.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {!voiceActive ? (
        <button
          type="button"
          className={styles.button}
          onClick={handleStartVoice}
          disabled={loading}
          aria-label="Start voice conversation"
        >
          🎤 Start Conversation
        </button>
      ) : (
        <button
          type="button"
          onClick={handleStopVoice}
          className={`${styles.button} ${styles.stopButton}`}
          disabled={loading}
          aria-label="Stop voice conversation"
        >
          ⏹ Stop Conversation
        </button>
      )}
      <SoundMeter listening={listening && voiceActive} />
      {voiceActive && (
        <div className={styles.status} role="status" aria-live="polite">
          {listening ? "Listening…" : transcript ? `Recognized: ${transcript}` : ""}
        </div>
      )}
    </div>
  );
}
