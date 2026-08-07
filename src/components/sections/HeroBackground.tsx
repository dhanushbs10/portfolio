'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const WebThreads = dynamic(() => import('@/components/WebThreads'), {
  ssr: false,
});

function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('webgl2');
  } catch {
    return false;
  }
}

// Converts "hsl(h s% l%)" or "hsl(h, s%, l%)" -> "#rrggbb"
function hslToHex(hsl: string): string {
  const m = hsl.match(/([\d.]+)[,\s]+([\d.]+)%[,\s]+([\d.]+)%/);
  if (!m) return '';
  const h = parseFloat(m[1]) / 360;
  const s = parseFloat(m[2]) / 100;
  const l = parseFloat(m[3]) / 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function resolveCssColor(varName: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const root = getComputedStyle(document.documentElement);
  let value = root.getPropertyValue(varName).trim();
  if (!value) return fallback;
  // getComputedStyle returns HSL for hsl() tokens; convert to hex for WebThreads
  if (value.startsWith('hsl')) return hslToHex(value);
  return value;
}

type Mode = 'loading' | 'animated' | 'static';

export default function HeroBackground() {
  const [mode, setMode] = useState<Mode>('loading');
  const [isMobile, setIsMobile] = useState(false);
  const [colors, setColors] = useState({
    c1: '#5227FF',
    c2: '#FF9FFC',
    c3: '#FFFFFF',
  });

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    setIsMobile(mobile);
    setColors({
      c1: resolveCssColor('--color-thread-1', '#5227FF'),
      c2: resolveCssColor('--color-thread-2', '#FF9FFC'),
      c3: resolveCssColor('--color-thread-3', '#FFFFFF'),
    });
    setMode(reducedMotion || !supportsWebGL2() ? 'static' : 'animated');
  }, []);

  // Avoid a flash of the wrong variant on first paint
  if (mode === 'loading') return null;

  if (mode === 'static') {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${colors.c3} 0%, transparent 70%)`,
          opacity: 0.35,
        }}
      />
    );
  }

  return (
    <div aria-hidden className="absolute inset-0">
      <WebThreads
        color1={colors.c1}
        color2={colors.c2}
        color3={colors.c3}
        speed={0.2}
        threadCount={isMobile ? 4 : 6}
        frequency={5}
        spread={0.18}
        taper={1}
        position={0.5}
        fanMode="center"
        glow={0.02}
        falloff={0.6}
        thickness={1.1}
        brightness={0.55}
        opacity={0.9}
        mirror
        shimmer={false}
        grain={!isMobile}
        grainIntensity={0.04}
        mouseInteraction={!isMobile}
        mouseStrength={0.25}
      />
    </div>
  );
}
