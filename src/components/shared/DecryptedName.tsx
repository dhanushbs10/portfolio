"use client";

import { useEffect, useState } from "react";
import DecryptedText from "@/components/DecryptedText";

interface DecryptedNameProps {
  text: string;
  className?: string;
}

export default function DecryptedName({ text, className }: DecryptedNameProps) {
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  if (reducedMotion === null) return null;

  if (reducedMotion) return <span className={className}>{text}</span>;

  return (
    <DecryptedText
      text={text}
      animateOn="view"
      sequential
      revealDirection="start"
      useOriginalCharsOnly
      speed={150}
      className={className}
      encryptedClassName={`${className ?? ""} opacity-60`}
      parentClassName="inline-block"
    />
  );
}
