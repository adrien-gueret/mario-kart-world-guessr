import { useEffect, useRef, useState } from "react";

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function useAnimatedScore(score: number, duration = 600) {
  const [scoreToRender, setScoreToRender] = useState(score);
  const animationRef = useRef<number>(0);
  const startRef = useRef(scoreToRender);
  const startTimeRef = useRef<DOMHighResTimeStamp>(0);

  useEffect(() => {
    if (scoreToRender === score) return;

    startRef.current = scoreToRender;
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const start = startRef.current;
      const diff = score - start;
      const elapsed = now - startTimeRef.current;
      const rawProgress = Math.min(elapsed / duration, 1);

      if (rawProgress < 1) {
        const progress = easeInOutCubic(rawProgress);
        const current = Math.round(start + diff * progress);
        setScoreToRender(current);
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setScoreToRender(score);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [score]);

  return scoreToRender;
}
