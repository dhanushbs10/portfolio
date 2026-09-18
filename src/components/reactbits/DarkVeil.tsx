import { useEffect, useRef } from 'react';

export default function DarkVeil() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width));
      const h = Math.max(1, Math.round(r.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const blobs = [
      { x: 0.2,  y: 0.12, r: 0.6,  base: 0,   ph: 0.0, hue: '59,130,246', a: 0.30 },
      { x: 0.85, y: 0.9,  r: 0.48, base: 2,   ph: 1.7, hue: '37,99,235',  a: 0.22 },
      { x: 0.55, y: 0.52, r: 0.65, base: 4,   ph: 3.2, hue: '96,165,250', a: 0.12 },
    ];

    const draw = () => {
      const t = (performance.now() - start) / 1000;
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;

      if (w > 2 && h > 2) {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#0b0d12';
        ctx.fillRect(0, 0, w, h);

        // drifting glow blobs - the veil
        for (const b of blobs) {
          const x = (b.x + Math.sin(t * 0.05 + b.ph) * 0.03) * w;
          const y = (b.y + Math.cos(t * 0.04 + b.ph * 1.3) * 0.03) * h;
          const r = b.r * Math.max(w, h) * (1 + Math.sin(t * 0.07 + b.base) * 0.08);
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, `rgba(${b.hue},${b.a})`);
          g.addColorStop(0.55, `rgba(${b.hue},${b.a * 0.4})`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }

        // flowing veil filaments
        ctx.lineWidth = 1.2;
        for (let i = 0; i < 6; i++) {
          const speed = 0.05 + i * 0.007;
          const amp = 28 + i * 9;
          const y0 = h * (0.28 + i * 0.085) + Math.sin(t * 0.5 + i) * 12;
          ctx.strokeStyle = `rgba(96,165,250,${0.05 + (i % 2) * 0.035})`;
          ctx.beginPath();
          ctx.moveTo(0, y0);
          for (let x = 0; x <= w; x += 16) {
            const y = y0
              + Math.sin(x * 0.008 + t * speed * 9 + i * 1.3) * amp
              + Math.sin(x * 0.02 - t * 0.7 + i) * 9;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // faint dot grid
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        const gap = 32;
        for (let x = 0; x < w; x += gap) {
          for (let y = 0; y < h; y += gap) {
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}