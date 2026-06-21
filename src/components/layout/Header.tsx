import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="header-glass w-full flex items-center justify-between px-6 md:px-8 py-4">
      <Link
        href="/"
        className="flex items-center gap-2.5"
        style={{ textDecoration: "none", color: "var(--accent)" }}
        aria-label="GRE Prep home"
      >
        <Logo size={40} />
        <span className="font-bold text-xl" style={{ color: "var(--ink)" }}>
          GRE Prep
        </span>
      </Link>
      <nav className="flex items-center gap-3">
        <div className="glass-nav flex items-center gap-1">
          <Link href="/" className="chip" style={{ textDecoration: "none" }}>
            Home
          </Link>
          <Link href="/practice" className="chip" style={{ textDecoration: "none" }}>
            Practice
          </Link>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
