"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`app-header ${scrolled ? "app-header--scrolled" : ""} w-full flex items-center justify-between px-6 md:px-8 py-4`}
    >
      <Link
        href="/"
        className="flex items-center gap-2.5"
        style={{ textDecoration: "none", color: "var(--accent)" }}
        aria-label="PrismPrep home"
      >
        <Logo size={40} />
        <span className="font-bold text-xl" style={{ color: "var(--ink)" }}>
          PrismPrep
        </span>
      </Link>
      <nav className="flex items-center gap-2 md:gap-3">
        <Link href="/" className="chip">
          Home
        </Link>
        <Link href="/practice" className="chip">
          Practice
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
