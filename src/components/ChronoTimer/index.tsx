import { useEffect, useRef, useState } from "react";

import { useTranslations } from "@/i18n";

import "./ChronoTimer.css";

type Props = {
  /** Whether the countdown is currently running (photo visible and playable). */
  running: boolean;
  /** Authoritative remaining time in milliseconds, coming from the server. */
  remainingMs: number;
  /** Called once when the countdown reaches zero. */
  onExpire: () => void;
};

function formatTime(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function ChronoTimer({ running, remainingMs, onExpire }: Props) {
  const [displayMs, setDisplayMs] = useState(remainingMs);

  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const hasExpiredRef = useRef(false);

  const { translate } = useTranslations();

  // Resync to the authoritative server value whenever it changes (after each
  // guess, on resume, etc.). This corrects any client-side drift.
  useEffect(() => {
    setDisplayMs(remainingMs);

    if (remainingMs > 0) {
      hasExpiredRef.current = false;
    }
  }, [remainingMs]);

  useEffect(() => {
    if (!running) {
      return;
    }

    const base = remainingMs;
    const start = performance.now();

    const tick = () => {
      const next = Math.max(0, base - (performance.now() - start));

      setDisplayMs(next);

      if (next <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        onExpireRef.current();
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 200);

    return () => window.clearInterval(intervalId);
  }, [running, remainingMs]);

  const isLow = displayMs <= 10000;

  return (
    <aside className={`chrono-timer ${isLow ? "chrono-timer-low" : ""}`}>
      <span className="chrono-timer-label">
        {translate("game.chrono.timer")}
      </span>
      <span className="chrono-timer-value">{formatTime(displayMs)}</span>
    </aside>
  );
}
