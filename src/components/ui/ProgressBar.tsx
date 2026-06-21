interface ProgressBarProps {
  value: number; // 0–100
  label?: string;
}

export default function ProgressBar({ value, label }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full">
      {label && (
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>
          {label}
        </p>
      )}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
