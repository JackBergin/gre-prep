"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Question, Answer, Section } from "@/lib/types";
import QuestionCard from "@/components/quiz/QuestionCard";
import AnswerOption from "@/components/quiz/AnswerOption";
import Timer from "@/components/quiz/Timer";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";

const SECTION_TIME: Record<string, number> = {
  verbal: 20 * 60,
  quantitative: 20 * 60,
  writing: 60 * 60,
};

const SECTION_LABEL: Record<string, string> = {
  verbal: "Verbal Reasoning",
  quantitative: "Quantitative Reasoning",
  writing: "Analytical Writing",
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const section = params.section as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [writingText, setWritingText] = useState("");
  const [multiSelected, setMultiSelected] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/questions?section=${section}`)
      .then((r) => r.json())
      .then((data: Question[]) => {
        setQuestions(data);
        setAnswers(data.map((q) => ({ questionId: q.id, selectedAnswer: null })));
        setLoading(false);
      });
  }, [section]);

  const currentQuestion = questions[currentIndex];
  const isWriting = section === "writing";
  const isMulti = currentQuestion?.type === "sentence-equivalence";

  const getSelected = (): string | string[] | null => {
    return answers[currentIndex]?.selectedAnswer ?? null;
  };

  const handleSelect = (option: string) => {
    if (isMulti) {
      setMultiSelected((prev) => {
        const next = prev.includes(option)
          ? prev.filter((o) => o !== option)
          : prev.length < 2
          ? [...prev, option]
          : [prev[1], option];
        setAnswers((ans) =>
          ans.map((a, i) => (i === currentIndex ? { ...a, selectedAnswer: next.length ? next : null } : a))
        );
        return next;
      });
    } else {
      setAnswers((ans) =>
        ans.map((a, i) => (i === currentIndex ? { ...a, selectedAnswer: option } : a))
      );
    }
  };

  const handleWritingChange = (text: string) => {
    setWritingText(text);
    setAnswers((ans) =>
      ans.map((a, i) => (i === currentIndex ? { ...a, selectedAnswer: text } : a))
    );
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      const nextAnswer = answers[currentIndex + 1];
      if (Array.isArray(nextAnswer?.selectedAnswer)) {
        setMultiSelected(nextAnswer.selectedAnswer);
      } else {
        setMultiSelected([]);
      }
      setWritingText(
        typeof answers[currentIndex + 1]?.selectedAnswer === "string"
          ? (answers[currentIndex + 1].selectedAnswer as string)
          : ""
      );
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = useCallback(async () => {
    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, answers }),
    });
    const result = await res.json();
    sessionStorage.setItem("quizResult", JSON.stringify(result));
    router.push("/results");
  }, [section, answers, router]);

  const handleExpire = useCallback(() => {
    submitQuiz();
  }, [submitQuiz]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="card flex items-center gap-4 px-10 py-8">
          <div
            className="w-8 h-8 rounded-full border-4 border-transparent"
            style={{
              borderTopColor: "var(--accent)",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span style={{ color: "var(--muted)" }}>Loading questions…</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card>No questions found for this section.</Card>
      </div>
    );
  }

  const progressPct = ((currentIndex + 1) / questions.length) * 100;
  const selected = getSelected();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <div className="flex items-center gap-3 mb-2">
            <Chip as="span">{SECTION_LABEL[section] ?? section}</Chip>
          </div>
          <ProgressBar value={progressPct} label={`${currentIndex + 1} / ${questions.length}`} />
        </div>
        <Timer seconds={SECTION_TIME[section] ?? 1200} onExpire={handleExpire} />
      </div>

      {/* Question */}
      <QuestionCard question={currentQuestion} index={currentIndex} total={questions.length} />

      {/* Answer area */}
      {isWriting ? (
        <Card className="flex flex-col gap-4">
          <p className="chip" style={{ boxShadow: "none", paddingLeft: 0, background: "transparent" }}>
            Your Response
          </p>
          <textarea
            className="input"
            style={{ minHeight: "280px", resize: "vertical" }}
            placeholder="Write your essay here…"
            value={writingText}
            onChange={(e) => handleWritingChange(e.target.value)}
          />
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Word count: {writingText.trim() ? writingText.trim().split(/\s+/).length : 0}
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {isMulti && (
            <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
              Select TWO answers that complete the sentence in the same way.
            </p>
          )}
          {currentQuestion.options?.map((opt) => {
            const isSelected = isMulti
              ? multiSelected.includes(opt)
              : selected === opt;
            return (
              <AnswerOption
                key={opt}
                label={opt}
                selected={isSelected}
                onClick={() => handleSelect(opt)}
              />
            );
          })}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => {
            if (currentIndex > 0) {
              setCurrentIndex((i) => i - 1);
              const prevAnswer = answers[currentIndex - 1];
              if (Array.isArray(prevAnswer?.selectedAnswer)) {
                setMultiSelected(prevAnswer.selectedAnswer);
              } else {
                setMultiSelected([]);
              }
              setWritingText(
                typeof answers[currentIndex - 1]?.selectedAnswer === "string"
                  ? (answers[currentIndex - 1].selectedAnswer as string)
                  : ""
              );
            }
          }}
          disabled={currentIndex === 0}
        >
          ← Back
        </Button>
        <Button onClick={goNext}>
          {currentIndex === questions.length - 1 ? "Submit Quiz" : "Next →"}
        </Button>
      </div>
    </div>
  );
}
