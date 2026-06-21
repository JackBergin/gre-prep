import Link from "next/link";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";

const sections = [
  {
    key: "verbal",
    title: "Verbal Reasoning",
    description:
      "Reading comprehension, text completion, and sentence equivalence. Test your command of English vocabulary and your ability to analyze written material.",
    questions: 10,
    time: "20 min",
    icon: "✦",
  },
  {
    key: "quantitative",
    title: "Quantitative Reasoning",
    description:
      "Arithmetic, algebra, geometry, and data analysis. Demonstrate your ability to reason quantitatively and solve problems using mathematical concepts.",
    questions: 10,
    time: "20 min",
    icon: "∑",
  },
  {
    key: "writing",
    title: "Analytical Writing",
    description:
      "Issue and argument tasks. Articulate complex ideas clearly, examine claims, and construct well-reasoned arguments.",
    questions: 2,
    time: "60 min",
    icon: "✎",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-20">
      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-6">
        <Chip as="span">GRE Test Prep</Chip>
        <h1 style={{ color: "var(--ink)" }}>
          Prepare Smarter.<br />
          <span style={{ color: "var(--accent)" }}>Score Higher.</span>
        </h1>
        <p className="max-w-xl text-lg" style={{ color: "var(--muted)" }}>
          Full-length GRE practice covering Verbal Reasoning, Quantitative Reasoning, and Analytical Writing — with instant scoring and detailed explanations.
        </p>
        <Link href="/practice" className="btn mt-2">
          Start Practicing →
        </Link>
      </section>

      {/* Section cards */}
      <section className="flex flex-col gap-6">
        <h2 style={{ color: "var(--ink)" }}>What&apos;s Covered</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((s) => (
            <Card key={s.key} className="flex flex-col gap-4">
              <div
                className="w-12 h-12 flex items-center justify-center rounded-2xl text-2xl font-bold text-white"
                style={{ background: "var(--accent)", boxShadow: "var(--raise)" }}
              >
                {s.icon}
              </div>
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
              <Link href={`/quiz/${s.key}`} className="btn btn--ghost" style={{ justifyContent: "center" }}>
                Begin →
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Practice Questions", value: "22" },
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
