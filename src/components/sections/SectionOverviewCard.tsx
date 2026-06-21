import Link from "next/link";
import SectionThumbnail from "@/components/art/SectionThumbnail";
import GlassCard from "@/components/ui/GlassCard";
import Chip from "@/components/ui/Chip";
import { sectionRayVar } from "@/lib/sections";
import { sectionMeta } from "@/lib/tests";
import type { Section } from "@/lib/types";

interface SectionOverviewCardProps {
  section: Section;
  questionCount: number;
  time: string;
  href: string;
  linkLabel?: string;
}

export default function SectionOverviewCard({
  section,
  questionCount,
  time,
  href,
  linkLabel = "View Tests →",
}: SectionOverviewCardProps) {
  const meta = sectionMeta[section];

  return (
    <GlassCard
      className="flex flex-col gap-4 p-6"
      style={{ "--section-ray": sectionRayVar[section] } as React.CSSProperties}
    >
      <SectionThumbnail section={section} />
      <div>
        <h3 style={{ color: "var(--ink)" }}>{meta.title}</h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          {meta.description}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap mt-auto">
        <Chip as="span">{questionCount} Questions</Chip>
        <Chip as="span">{time}</Chip>
      </div>
      <Link href={href} className="btn btn--ghost" style={{ justifyContent: "center" }}>
        {linkLabel}
      </Link>
    </GlassCard>
  );
}
