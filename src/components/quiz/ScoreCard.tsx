import { ScoreResult } from "@/lib/types";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import ProgressBar from "@/components/ui/ProgressBar";

interface ScoreCardProps {
  result: ScoreResult;
}

const sectionLabel: Record<string, string> = {
  verbal: "Verbal Reasoning",
  quantitative: "Quantitative Reasoning",
  writing: "Analytical Writing",
};

const performanceLabel = (pct: number) => {
  if (pct >= 90) return "Excellent";
  if (pct >= 75) return "Strong";
  if (pct >= 60) return "Proficient";
  if (pct >= 40) return "Developing";
  return "Needs Work";
};

export default function ScoreCard({ result }: ScoreCardProps) {
  const pct = result.totalQuestions > 0
    ? Math.round((result.correctCount / result.totalQuestions) * 100)
    : 0;

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h3 style={{ color: "var(--ink)" }}>{sectionLabel[result.section] ?? result.section}</h3>
          {result.section !== "writing" && (
            <p className="mt-1" style={{ color: "var(--muted)", fontSize: "14px" }}>
              Scaled score: <strong style={{ color: "var(--accent)" }}>{result.scaledScore}</strong> / 170
            </p>
          )}
        </div>
        <Chip as="span">{performanceLabel(pct)}</Chip>
      </div>

      <ProgressBar value={pct} label={`${pct}% correct`} />

      <div className="flex gap-4 flex-wrap">
        <StatPill label="Correct" value={result.correctCount} color="#22c55e" />
        <StatPill label="Incorrect" value={result.incorrectCount} color="#ef4444" />
        <StatPill label="Skipped" value={result.skippedCount} color="var(--muted)" />
      </div>
    </Card>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="flex flex-col items-center px-5 py-3 rounded-2xl"
      style={{ background: "var(--bg)", boxShadow: "var(--raise)" }}
    >
      <span className="text-2xl font-bold" style={{ color }}>
        {value}
      </span>
      <span className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: "var(--muted)" }}>
        {label}
      </span>
    </div>
  );
}
