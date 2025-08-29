import React, { useEffect, useRef } from "react";

export default function SoundMeter({ listening }) {
  const canvasRef = useRef();

  useEffect(() => {
    let audioContext;
    let analyser;
    let dataArray;
    let source;
    let animationId;
    let stream;

    async function setup() {
      try {
        if (!listening) return;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        source.connect(analyser);

        function draw() {
          analyser.getByteTimeDomainData(dataArray);
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = "#ff7000";
          ctx.lineWidth = 7;
          ctx.beginPath();

          let maxAmplitude = 0;
          for (let i = 0; i < dataArray.length; i++) {
            maxAmplitude = Math.max(maxAmplitude, Math.abs(dataArray[i] - 128));
          }
          // Orange bar for amplitude
          const barLength = (maxAmplitude / 128) * canvas.width;

          ctx.moveTo(4, canvas.height / 2);
          ctx.lineTo(barLength, canvas.height / 2);

          ctx.stroke();
          animationId = requestAnimationFrame(draw);
        }
        draw();
      } catch {
        /* fail silently on forbidden */
      }
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
      width={180}
      height={24}
      style={{
        background: "#fff",
        border: "2px solid #ffb066",
        borderRadius: "10px",
        margin: "0.6em auto 0 auto",
        display: "block"
      }}
      aria-label="Microphone level"
    />
  );
}
