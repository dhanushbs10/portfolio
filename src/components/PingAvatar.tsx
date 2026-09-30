import { Blobatar } from "@blobatar/react";
import { useGaze } from "@blobatar/react/gaze";
import "blobatar/motion.css";
import "blobatar/gaze.css";

export default function PingAvatar({ size = 42 }: { size?: number }) {
  const { ref } = useGaze({ travel: 3, lookAt: "pointer" });
  return <Blobatar ref={ref} name="bsdhanush" hue={225} animate="always" size={size} />;
}
