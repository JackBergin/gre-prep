import Link from "next/link";
import HomeHero from "@/components/home/HomeHero";
import SectionOverviewCard from "@/components/sections/SectionOverviewCard";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import { getQuestionCountBySection } from "@/lib/questions";
import { sections } from "@/lib/sections";
import { getTotalQuestionCount } from "@/lib/tests";

export default function HomePage() {
  const totalQuestions = getTotalQuestionCount();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-20">
      <HomeHero
        headline={
          <>
            <Chip as="span">PrismPrep</Chip>
            <h1 style={{ color: "var(--ink)" }}>
              Clarity from
              <br />
              <span style={{ color: "var(--ink)" }}>Complexity.</span>
            </h1>
          </>
        }
      >
        <p className="max-w-xl text-lg" style={{ color: "var(--muted)" }}>
          GRE prep is a lot to absorb. PrismPrep refracts it into three focused paths — Verbal,
          Quantitative, and Writing — with timed practice and instant feedback.
        </p>
        <Link href="/practice" className="btn mt-2">
          Browse Test Gallery →
        </Link>
      </HomeHero>

      <section className="flex flex-col gap-6">
        <h2 style={{ color: "var(--ink)" }}>What&apos;s Covered</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((key) => (
            <SectionOverviewCard
              key={key}
              section={key}
              questionCount={getQuestionCountBySection(key) as number}
              time={key === "writing" ? "60 min" : "20 min"}
              href={`/practice#${key}`}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Practice Questions", value: String(totalQuestions) },
          { label: "Practice Paths", value: "3" },
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
