import React, { useEffect, useRef } from "react";

export default function SoundMeter({ listening }) {
  const canvasRef = useRef();

  useEffect(() => {
    if (!listening) return;
    let audioContext;
    let analyser;
    let dataArray;
    let source;
    let animationId;
    let stream;

    async function setup() {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;  // More resolution for wave effect
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        source.connect(analyser);

        function draw() {
          analyser.getByteTimeDomainData(dataArray);
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Wave style
          ctx.beginPath();
          ctx.strokeStyle = "#ff7000";
          ctx.lineWidth = 4;
          const sliceWidth = canvas.width / dataArray.length;
          let x = 0;
          for (let i = 0; i < dataArray.length; i++) {
            let v = dataArray[i] / 128.0;
            let y = (v * canvas.height) / 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += sliceWidth;
          }
          ctx.stroke();
          animationId = requestAnimationFrame(draw);
        }
        draw();
      } catch (error) {}
    }

    setup();

    return () => {
      if (audioContext) audioContext.close();
      if (stream) stream.getTracks().forEach(track => track.stop());
      cancelAnimationFrame(animationId);
    };
  }, [listening]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={48}
      style={{
        background: "#fff",
        border: "2px solid #ffb066",
        borderRadius: "12px",
        margin: "1em auto 1em auto",
        display: listening ? "block" : "none"
      }}
      aria-label="Microphone level"
    />
  );
}
