"use client";
import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";

interface TimerProps {
  seconds: number;
  onExpire?: () => void;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function Timer({ seconds, onExpire }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire?.();
      return;
    }
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [remaining, onExpire]);

  const pct = (remaining / seconds) * 100;
  const urgent = pct < 20;

  return (
    <Card padding="sm" className="flex items-center gap-3 min-w-[110px]">
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
        Time
      </span>
      <span
        className="text-xl font-bold tabular-nums"
        style={{ color: urgent ? "#ef4444" : "var(--accent)" }}
      >
        {fmt(remaining)}
      </span>
    </Card>
  );
}
