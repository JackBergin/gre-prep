"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/practice", label: "Practice" },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-3">
      {links.map(({ href, label }) => (
        <Link key={href} href={href} style={{ textDecoration: "none" }}>
          <span className={`chip ${pathname === href ? "chip--active" : ""}`}>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
