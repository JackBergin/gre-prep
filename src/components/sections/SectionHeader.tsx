import type { ReactNode } from "react";
import SectionThumbnail from "@/components/art/SectionThumbnail";
import { sectionMeta } from "@/lib/tests";
import type { Section } from "@/lib/types";

interface SectionHeaderProps {
  section: Section;
  children?: ReactNode;
}

export default function SectionHeader({ section, children }: SectionHeaderProps) {
  const meta = sectionMeta[section];

  return (
    <div className="flex items-center gap-4">
      <SectionThumbnail section={section} />
      <div className="flex-1">
        <h2 style={{ color: "var(--ink)" }}>{meta.title}</h2>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          {meta.description}
        </p>
      </div>
      {children}
    </div>
  );
}
