import { useEffect, useRef } from 'react';

export default function DarkVeil() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      t += 0.002;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // dark base
      ctx.fillStyle = '#0b0d12';
      ctx.fillRect(0, 0, w, h);

      // veil gradients - React Bits Dark Veil, now clearly visible
      const g1 = ctx.createRadialGradient(w * 0.22, h * 0.18, 0, w * 0.22, h * 0.18, w * 0.85);
      g1.addColorStop(0, 'rgba(60,70,110,0.55)');
      g1.addColorStop(0.4, 'rgba(40,45,75,0.28)');
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w * 0.78, h * 0.88, 0, w * 0.78, h * 0.88, w * 0.65);
      g2.addColorStop(0, 'rgba(70,80,120,0.22)');
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      const g3 = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, w * 0.75);
      g3.addColorStop(0, 'rgba(50,60,90,0.12)');
      g3.addColorStop(1, 'transparent');
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, w, h);

      // grid - faint React Bits Dot Grid
      ctx.fillStyle = 'rgba(255,255,255,0.045)';
      const gap = 28;
      for (let x = 0; x < w; x += gap) {
        for (let y = 0; y < h; y += gap) {
          ctx.beginPath();
          ctx.arc(x, y, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // threads
      ctx.strokeStyle = 'rgba(255,255,255,0.055)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const y = h * 0.32 + i * 68 + Math.sin(t * 0.5 + i) * 16;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(w * 0.32, y - 22, w * 0.68, y + 22, w, y);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}
