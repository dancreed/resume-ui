import React, { useEffect, useRef } from "react";

export default function SoundMeter({ listening }) {
  const canvasRef = useRef();

  useEffect(() => {
    let audioContext, analyser, animationId, stream, dataArray;

    async function setup() {
      if (!listening) return;
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const input = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        input.connect(analyser);

        function draw() {
          analyser.getByteTimeDomainData(dataArray);
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Orange waveform
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#ff7000";
          const sliceWidth = canvas.width / dataArray.length;
          let x = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * canvas.height) / 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += sliceWidth;
          }
          ctx.stroke();

          // Softer shadow effect below (for visual flair)
          ctx.globalAlpha = 0.3;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.strokeStyle = "#ffb066";
          x = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const v = dataArray[i] / 128.0;
            const y = canvas.height / 2 + ((v * canvas.height) / 2) * 0.6;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += sliceWidth;
          }
          ctx.stroke();
          ctx.globalAlpha = 1;

          animationId = requestAnimationFrame(draw);
        }
        draw();
      } catch {}
    }

    setup();
    return () => {
      try {
        if (audioContext) audioContext.close();
        if (animationId) cancelAnimationFrame(animationId);
        if (stream) stream.getTracks().forEach(track => track.stop());
      } catch {}
    };
  }, [listening]);

  return (
    <canvas
      ref={canvasRef}
      width={340}
      height={54}
      style={{
        background: "#fff",
        border: "2px solid #ffb066",
        borderRadius: "12px",
        margin: "1em auto 0 auto",
        display: listening ? "block" : "none"
      }}
      aria-label="Microphone Activity Waveform"
    />
  );
}
