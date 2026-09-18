import { useEffect, useRef } from 'react';

export default function HomeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let h = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    window.addEventListener('resize', onResize);

    // subtle dot grid + aurora inspired by React Bits Aurora/Dot Grid
    let raf = 0;
    let t = 0;
    const draw = () => {
      t += 0.003;
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      // aurora blobs - very subtle, monochrome blue tint but desaturated to avoid vibe-coded flat
      const g1 = ctx.createRadialGradient(cw * 0.18, ch * 0.15, 0, cw * 0.18, ch * 0.15, cw * 0.6);
      g1.addColorStop(0, 'rgba(59,130,246,0.07)');
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, cw, ch);

      const g2 = ctx.createRadialGradient(cw * 0.82, ch * 0.85, 0, cw * 0.82, ch * 0.85, cw * 0.5);
      g2.addColorStop(0, 'rgba(96,165,250,0.04)');
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, cw, ch);

      // dot grid - faint, like React Bits Dot Grid
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      const gap = 28;
      const dot = 1;
      for (let x = (t * 20) % gap; x < cw; x += gap) {
        for (let y = 0; y < ch; y += gap) {
          ctx.beginPath();
          ctx.arc(x, y, dot, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // thin threads - faint horizontal lines drifting
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const y = (ch * 0.3 + i * 60 + Math.sin(t * 0.5 + i) * 10);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(cw * 0.33, y - 20, cw * 0.66, y + 20, cw, y);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-60"
      style={{ filter: 'blur(0.3px)' }}
      aria-hidden
    />
  );
}
