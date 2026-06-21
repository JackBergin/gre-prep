import Link from "next/link";

export default function Header() {
  return (
    <header
      className="w-full flex items-center justify-between px-8 py-5"
      style={{ background: "var(--bg)", boxShadow: "0 4px 12px var(--dark)" }}
    >
      <Link href="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg"
          style={{ background: "var(--accent)", boxShadow: "var(--raise)" }}
        >
          G
        </div>
        <span className="font-bold text-xl" style={{ color: "var(--ink)" }}>
          GRE Prep
        </span>
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/" className="chip" style={{ boxShadow: "none", textDecoration: "none" }}>
          Home
        </Link>
        <Link href="/practice" className="chip" style={{ boxShadow: "none", textDecoration: "none" }}>
          Practice
        </Link>
      </nav>
    </header>
  );
}
