"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import SectionHeader from "@/components/sections/SectionHeader";
import { Section, TestDefinition } from "@/lib/types";
import { sections } from "@/lib/sections";
import { formatTime, getTotalQuestionCount } from "@/lib/tests";
import { getQuestionCountBySection } from "@/lib/questions";

export default function PracticePage() {
  const [testsBySection, setTestsBySection] = useState<Record<Section, TestDefinition[]>>({
    verbal: [],
    quantitative: [],
    writing: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      sections.map((section) =>
        fetch(`/api/tests?section=${section}`)
          .then((r) => r.json())
          .then((data: TestDefinition[]) => ({ section, data }))
      )
    ).then((results) => {
      const next = { verbal: [], quantitative: [], writing: [] } as Record<
        Section,
        TestDefinition[]
      >;
      for (const { section, data } of results) {
        next[section] = data;
      }
      setTestsBySection(next);
      setLoading(false);
    });
  }, []);

  const counts = getQuestionCountBySection();
  const totalQuestions = getTotalQuestionCount();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        <Chip as="span">Test Gallery</Chip>
        <h1 style={{ color: "var(--ink)" }}>Practice Tests</h1>
        <p style={{ color: "var(--muted)" }}>
          Choose a curated test from our library of {totalQuestions}+ questions. Each path has a
          set time limit and instant scoring with detailed explanations.
        </p>
      </div>

      {loading ? (
        <Card className="text-center py-10" style={{ color: "var(--muted)" }}>
          Loading tests…
        </Card>
      ) : (
        <div className="flex flex-col gap-10">
          {sections.map((section) => {
            const sectionCount =
              typeof counts === "object" ? counts[section] : counts;
            const sectionTests = testsBySection[section];

            return (
              <section key={section} id={section} className="flex flex-col gap-5">
                <SectionHeader section={section}>
                  <Chip as="span">{sectionCount} in bank</Chip>
                </SectionHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectionTests.map((test) => (
                    <Card key={test.id} className="flex flex-col gap-4">
                      <div>
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
