import Link from "next/link";
import HomeHero from "@/components/home/HomeHero";
import SectionThumbnail from "@/components/art/SectionThumbnail";
import GlassCard from "@/components/ui/GlassCard";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import { getQuestionCountBySection } from "@/lib/questions";
import { getTotalQuestionCount, sectionMeta } from "@/lib/tests";

const sections = (["verbal", "quantitative", "writing"] as const).map((key) => ({
  key,
  ...sectionMeta[key],
  questions: getQuestionCountBySection(key) as number,
  time: key === "writing" ? "60 min" : "20 min",
}));

export default function HomePage() {
  const totalQuestions = getTotalQuestionCount();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-20">
      <HomeHero>
        <Chip as="span">GRE Test Prep</Chip>
        <h1 style={{ color: "var(--ink)" }}>
          Prepare Smarter.
          <br />
          <span style={{ color: "var(--accent)" }}>Score Higher.</span>
        </h1>
        <p className="max-w-xl text-lg" style={{ color: "var(--muted)" }}>
          Full-length GRE practice covering Verbal Reasoning, Quantitative Reasoning, and
          Analytical Writing — with instant scoring and detailed explanations.
        </p>
        <Link href="/practice" className="btn mt-2">
          Browse Test Gallery →
        </Link>
      </HomeHero>

      <section className="flex flex-col gap-6">
        <h2 style={{ color: "var(--ink)" }}>What&apos;s Covered</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((s) => (
            <GlassCard key={s.key} className="flex flex-col gap-4 p-6">
              <SectionThumbnail section={s.key} />
              <div>
                <h3 style={{ color: "var(--ink)" }}>{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {s.description}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap mt-auto">
                <Chip as="span">{s.questions} Questions</Chip>
                <Chip as="span">{s.time}</Chip>
              </div>
              <Link
                href={`/practice#${s.key}`}
                className="btn btn--ghost"
                style={{ justifyContent: "center" }}
              >
                View Tests →
              </Link>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Practice Questions", value: String(totalQuestions) },
          { label: "GRE Sections", value: "3" },
          { label: "Instant Feedback", value: "✓" },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col items-center text-center gap-2">
            <span className="text-5xl font-bold" style={{ color: "var(--accent)" }}>
              {stat.value}
            </span>
            <span className="chip" style={{ boxShadow: "none" }}>
              {stat.label}
            </span>
          </Card>
        ))}
      </section>
    </div>
  );
}
