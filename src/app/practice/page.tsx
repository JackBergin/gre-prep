"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import SectionHeader from "@/components/sections/SectionHeader";
import { Section, TestDefinition } from "@/lib/types";
import { sections } from "@/lib/sections";
import { sectionRayVar } from "@/lib/sections";
import { formatTime, getTestsBySection, getTotalQuestionCount, sectionMeta } from "@/lib/tests";
import { getQuestionCountBySection } from "@/lib/questions";

type SectionFilter = Section | "all";
type SortKey = "featured" | "questions-desc" | "questions-asc" | "time-asc" | "time-desc";

const sectionFilters: { key: SectionFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "verbal", label: "Verbal" },
  { key: "quantitative", label: "Quant" },
  { key: "writing", label: "Writing" },
];

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "questions-desc", label: "Most questions" },
  { key: "questions-asc", label: "Fewest questions" },
  { key: "time-asc", label: "Shortest time" },
  { key: "time-desc", label: "Longest time" },
];

function sortTests(list: TestDefinition[], sort: SortKey): TestDefinition[] {
  if (sort === "featured") return list;
  const copy = [...list];
  switch (sort) {
    case "questions-desc":
      return copy.sort((a, b) => b.questionCount - a.questionCount);
    case "questions-asc":
      return copy.sort((a, b) => a.questionCount - b.questionCount);
    case "time-asc":
      return copy.sort((a, b) => a.timeLimit - b.timeLimit);
    case "time-desc":
      return copy.sort((a, b) => b.timeLimit - a.timeLimit);
    default:
      return copy;
  }
}

// Test definitions are static local data, so they can be derived directly
// without a network round-trip — this keeps the page fully static.
const testsBySection: Record<Section, TestDefinition[]> = {
  verbal: getTestsBySection("verbal"),
  quantitative: getTestsBySection("quantitative"),
  writing: getTestsBySection("writing"),
};

export default function PracticePage() {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState<SectionFilter>("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const counts = getQuestionCountBySection();
  const totalQuestions = getTotalQuestionCount();

  const visibleSections = useMemo(
    () => (activeSection === "all" ? sections : [activeSection]),
    [activeSection]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result: { section: Section; tests: TestDefinition[] }[] = [];
    for (const section of visibleSections) {
      const matched = testsBySection[section].filter((t) => {
        if (!q) return true;
        return (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        );
      });
      result.push({ section, tests: sortTests(matched, sort) });
    }
    return result;
  }, [visibleSections, testsBySection, query, sort]);

  const resultCount = filtered.reduce((sum, group) => sum + group.tests.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <Chip as="span" className="self-start">
          Test Gallery
        </Chip>
        <h1 className="page-header__title" style={{ color: "var(--ink)" }}>
          Practice Tests
        </h1>
        <p className="max-w-2xl text-lg" style={{ color: "var(--muted)" }}>
          Choose a curated test from our library of {totalQuestions}+ questions. Each path has a
          set time limit and instant scoring with detailed explanations.
        </p>
      </header>

      <Card className="toolbar">
            <div className="search-field">
              <span className="search-field__icon" aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                className="input"
                placeholder="Search tests by name or focus…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search practice tests"
              />
            </div>

            <div className="toolbar__controls">
              <div className="toolbar__filters" role="group" aria-label="Filter by section">
                {sectionFilters.map((f) => (
                  <Chip
                    key={f.key}
                    active={activeSection === f.key}
                    onClick={() => setActiveSection(f.key)}
                    aria-pressed={activeSection === f.key}
                  >
                    {f.label}
                  </Chip>
                ))}
              </div>

              <select
                className="input"
                style={{ width: "auto", minWidth: "190px" }}
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort tests"
              >
                {sortOptions.map((o) => (
                  <option key={o.key} value={o.key}>
                    Sort: {o.label}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Showing {resultCount} {resultCount === 1 ? "test" : "tests"}
            {query.trim() ? ` matching “${query.trim()}”` : ""}
          </p>

          {resultCount === 0 ? (
            <Card className="flex flex-col items-center text-center gap-4 py-12">
              <p style={{ color: "var(--ink)", fontWeight: 600 }}>No tests match your search.</p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Try a different keyword or clear the filters.
              </p>
              <button
                className="btn btn--ghost"
                onClick={() => {
                  setQuery("");
                  setActiveSection("all");
                  setSort("featured");
                }}
              >
                Reset filters
              </button>
            </Card>
          ) : (
            <div className="flex flex-col gap-12">
              {filtered.map(({ section, tests }) => {
                if (tests.length === 0) return null;
                const sectionCount =
                  typeof counts === "object" ? counts[section] : counts;

                return (
                  <section key={section} id={section} className="flex flex-col gap-5 scroll-mt-24">
                    <SectionHeader section={section}>
                      <Chip as="span">{sectionCount} in bank</Chip>
                    </SectionHeader>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tests.map((test) => (
                        <PracticeTestCard key={test.id} test={test} section={section} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
    </div>
  );
}

function PracticeTestCard({ test, section }: { test: TestDefinition; section: Section }) {
  return (
    <Card
      className="flex flex-col gap-4"
      style={{ "--section-ray": sectionRayVar[section] } as React.CSSProperties}
    >
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full"
          style={{ background: "var(--section-ray)" }}
          aria-hidden="true"
        />
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--muted)" }}
        >
          {sectionMeta[section].title}
        </span>
      </div>

      <div className="flex-1">
        <h3 style={{ color: "var(--ink)" }}>{test.title}</h3>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--muted)" }}>
          {test.description}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Chip as="span">{test.questionCount} Qs</Chip>
        <Chip as="span">{formatTime(test.timeLimit)}</Chip>
      </div>

      <Link
        href={`/quiz/${section}?test=${test.id}`}
        className="btn mt-auto"
        style={{ justifyContent: "center" }}
      >
        Start Test →
      </Link>
    </Card>
  );
}
