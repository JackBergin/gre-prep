"use client";

import HeroField from "@/components/art/HeroField";

interface HomeHeroProps {
  headline: React.ReactNode;
  children: React.ReactNode;
}

export default function HomeHero({ headline, children }: HomeHeroProps) {
  return (
    <section className="hero-section">
      <div className="hero-section__content">
        <div className="glass-panel flex flex-col items-center text-center gap-6 p-8 md:p-10" style={{ overflow: "hidden" }}>
          <HeroField />
          <div className="hero-section__headline-wrap">
            <div className="hero-section__headline">{headline}</div>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
