"use client";

import HeroField from "@/components/art/HeroField";

interface HomeHeroProps {
  children: React.ReactNode;
}

export default function HomeHero({ children }: HomeHeroProps) {
  return (
    <section className="hero-section">
      <HeroField />
      <div className="hero-section__content">
        <div className="glass-panel flex flex-col items-center text-center gap-6 p-8 md:p-10">
          {children}
        </div>
      </div>
    </section>
  );
}
