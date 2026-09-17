import { useEffect, useState, useRef } from 'react';

interface Props {
  text: string;
  speed?: number;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'hover';
}

export default function DecryptedText({
  text,
  speed = 30,
  className = '',
  encryptedClassName = 'opacity-40',
  parentClassName = '',
  animateOn = 'view'
}: Props) {
  const [display, setDisplay] = useState(text);
  const [isHover, setIsHover] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const chars = '01<>[]{}#@%&_-$+*';

  useEffect(() => {
    if (animateOn !== 'view') return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplay(
        text.split('').map((c, idx) => {
          if (c === ' ') return ' ';
          if (idx < i) return c;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, animateOn]);

  const handleEnter = () => {
    if (animateOn !== 'hover') return;
    setIsHover(true);
    let i = 0;
    const iv = setInterval(() => {
      setDisplay(
        text.split('').map((c, idx) => {
          if (c === ' ') return ' ';
          if (idx < i) return c;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      i++;
      if (i > text.length) clearInterval(iv);
    }, 20);
  };

  return (
    <span
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setDisplay(text)}
      className={`inline-block ${parentClassName}`}
    >
      {display.split('').map((c, idx) => (
        <span key={idx} className={display[idx] === text[idx] ? className : encryptedClassName}>
          {c}
        </span>
      ))}
    </span>
  );
}
