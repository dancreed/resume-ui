import React, { useState, useEffect } from "react";
import { useSpeechRecognition } from "react-speech-recognition";
import { AIService } from "./services/aiService";
import ProfileHeader from "./components/ProfileHeader";
import VoiceControls from "./components/VoiceControls";
import ChatInterface from "./components/ChatInterface";
import ErrorBoundary from "./components/ErrorBoundary";
import styles from "./styles/App.module.css";
import "./styles/globals.css";

// Enhanced TTS with preferred female voices
function getPreferredVoice() {
  const voices = window.speechSynthesis.getVoices();
  const preferred = [
    "Google US English",
    "Microsoft Aria Online (Natural) - English (United States)",
    "Microsoft Zira Desktop - English (United States)",
    "Samantha"
  ];
  return voices.find(v => preferred.includes(v.name))
    || voices.find(v => v.lang.startsWith("en") && v.gender === "female")
    || voices.find(v => v.lang.startsWith("en"));
}

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  // Ensure voices are loaded
  const callTTS = () => {
    const voice = getPreferredVoice();
    const utter = new window.SpeechSynthesisUtterance(text);
    if (voice) utter.voice = voice;
    utter.rate = 1;
    utter.pitch = 1.06;
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  };
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = callTTS;
  } else {
    callTTS();
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

  useEffect(() => {
    if (answer) speak(answer);
  }, [answer]);



  async function sendVoiceQuestion(speechText) {
    setAnswer("");
    setError("");
    setLoading(true);
    try {
      const result = await AIService.askQuestion(speechText);
      setAnswer(result);
    } catch (err) {
      setError("Sorry, something went wrong. " + ((err && err.message) || err));
    } finally {
      setLoading(false);
      if (voiceActive) {
        setTimeout(() => {
          resetTranscript();
          // Note: SpeechRecognition import removed, using from VoiceControls
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
      const result = await AIService.askQuestion(question);
      setAnswer(result);
    } catch (err) {
      setError("Sorry, something went wrong. " + ((err && err.message) || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <ProfileHeader />
        
        <ChatInterface 
          question={question}
          setQuestion={setQuestion}
          handleAsk={handleAsk}
          loading={loading}
          voiceActive={voiceActive}
          answer={answer}
          error={error}
        />
        
        <VoiceControls 
          voiceActive={voiceActive}
          setVoiceActive={setVoiceActive}
          listening={listening}
          transcript={transcript}
          resetTranscript={resetTranscript}
          browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
          loading={loading}
        />
      </div>
    </ErrorBoundary>
  );
}
