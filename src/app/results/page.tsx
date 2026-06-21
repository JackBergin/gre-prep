"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ScoreResult, QuestionResult } from "@/lib/types";
import ScoreCard from "@/components/quiz/ScoreCard";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import AnswerOption from "@/components/quiz/AnswerOption";

export default function ResultsPage() {
  const [result, setResult] = useState<ScoreResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("quizResult");
    if (raw) {
      try {
        setResult(JSON.parse(raw));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="card flex flex-col items-center gap-6 px-10 py-12">
          <p style={{ color: "var(--muted)" }}>No results found. Complete a quiz first.</p>
          <Link href="/practice" className="btn">
            Go to Practice →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Chip as="span">Quiz Complete</Chip>
        <h1 style={{ color: "var(--ink)" }}>Your Results</h1>
        <p style={{ color: "var(--muted)" }}>
          Here&apos;s how you performed. Review explanations below to strengthen your understanding.
        </p>
      </div>

      {/* Score summary */}
      <ScoreCard result={result} />

      {/* Answer review */}
      <div className="flex flex-col gap-6">
        <h2 style={{ color: "var(--ink)" }}>Answer Review</h2>
        {result.results.map((r: QuestionResult, idx: number) => (
          <ReviewItem key={r.question.id} result={r} index={idx} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4 flex-wrap">
        <Link href="/practice" className="btn">
          Practice Again →
        </Link>
        <Link href="/" className="btn btn--ghost">
          Home
        </Link>
      </div>
    </div>
  );
}

function ReviewItem({ result, index }: { result: QuestionResult; index: number }) {
  const { question, selectedAnswer, isCorrect } = result;
  const isWriting = question.section === "writing";
  const [open, setOpen] = useState(false);

  return (
    <Card className="flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm text-white flex-shrink-0"
            style={{ background: isWriting ? "var(--accent)" : isCorrect ? "#22c55e" : "#ef4444" }}
          >
            {isWriting ? "—" : isCorrect ? "✓" : "✗"}
          </span>
          <span className="font-semibold" style={{ color: "var(--ink)" }}>
            Question {index + 1}
          </span>
        </div>
        <Chip as="span">{question.type.replace(/-/g, " ")}</Chip>
      </div>

      {/* Prompt (truncated) */}
      <p className="text-sm leading-relaxed" style={{ color: "var(--ink)", whiteSpace: "pre-line" }}>
        {question.prompt.length > 200 ? question.prompt.slice(0, 200) + "…" : question.prompt}
      </p>

      {/* Answer options */}
      {!isWriting && question.options && (
        <div className="flex flex-col gap-2">
          {question.options.map((opt) => {
            const correctAnswers = Array.isArray(question.correctAnswer)
              ? question.correctAnswer
              : [question.correctAnswer];
            const selectedAnswers = Array.isArray(selectedAnswer)
              ? selectedAnswer
              : [selectedAnswer];
            const isThisCorrect = correctAnswers.includes(opt);
            const isThisSelected = selectedAnswers.includes(opt as string);

            let correct: boolean | null = null;
            let incorrect: boolean | null = null;

            if (isThisCorrect) correct = true;
            else if (isThisSelected && !isThisCorrect) incorrect = true;

            return (
              <AnswerOption
                key={opt}
                label={opt}
                selected={isThisSelected && !isThisCorrect}
                correct={correct}
                incorrect={incorrect}
                disabled
                onClick={() => {}}
              />
            );
          })}
        </div>
      )}

      {/* Writing response */}
      {isWriting && selectedAnswer && (
        <div
          className="rounded-xl p-4 text-sm leading-relaxed"
          style={{ boxShadow: "var(--press)", color: "var(--ink)" }}
        >
          <p className="chip mb-2" style={{ boxShadow: "none", background: "transparent", paddingLeft: 0 }}>
            Your Response
          </p>
          <p style={{ whiteSpace: "pre-line" }}>{selectedAnswer as string}</p>
        </div>
      )}

      {/* Explanation toggle */}
      <button
        className="text-left text-sm font-semibold"
        style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "▲ Hide explanation" : "▼ Show explanation"}
      </button>

      {open && (
        <div
          className="rounded-xl p-4 text-sm leading-relaxed"
          style={{ boxShadow: "var(--press)", color: "var(--ink)" }}
        >
          {question.explanation}
        </div>
      )}
    </Card>
  );
}
