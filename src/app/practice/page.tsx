"use client";
import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";

const sections = [
  {
    key: "verbal",
    title: "Verbal Reasoning",
    description: "Reading comprehension, text completion, and sentence equivalence questions.",
    icon: "✦",
    count: 10,
    difficulties: ["All", "Easy", "Medium", "Hard"],
  },
  {
    key: "quantitative",
    title: "Quantitative Reasoning",
    description: "Arithmetic, algebra, geometry, and data analysis problems.",
    icon: "∑",
    count: 10,
    difficulties: ["All", "Easy", "Medium", "Hard"],
  },
  {
    key: "writing",
    title: "Analytical Writing",
    description: "Issue and argument essay prompts with detailed scoring rubrics.",
    icon: "✎",
    count: 2,
    difficulties: ["All"],
  },
];

export default function PracticePage() {
  const [activeDifficulty, setActiveDifficulty] = useState<Record<string, string>>({
    verbal: "All",
    quantitative: "All",
    writing: "All",
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        <Chip as="span">Select Section</Chip>
        <h1 style={{ color: "var(--ink)" }}>Practice Tests</h1>
        <p style={{ color: "var(--muted)" }}>
          Choose a section to begin. Each quiz tracks your time and scores your answers instantly.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {sections.map((s) => (
          <Card key={s.key} className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl text-xl font-bold text-white"
                style={{ background: "var(--accent)", boxShadow: "var(--raise)" }}
              >
                {s.icon}
              </div>
              <div className="flex-1">
                <h3 style={{ color: "var(--ink)" }}>{s.title}</h3>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                  {s.description}
                </p>
              </div>
              <Chip as="span">{s.count} Qs</Chip>
            </div>

            {/* Difficulty filter */}
            <div className="flex gap-2 flex-wrap">
              {s.difficulties.map((d) => (
                <Chip
                  key={d}
                  active={activeDifficulty[s.key] === d}
                  onClick={() =>
                    setActiveDifficulty((prev) => ({ ...prev, [s.key]: d }))
                  }
                >
                  {d}
                </Chip>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link href={`/quiz/${s.key}`} className="btn">
                Start Quiz →
              </Link>
              <Link href={`/quiz/${s.key}`} className="btn btn--ghost">
                Timed Mode
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
