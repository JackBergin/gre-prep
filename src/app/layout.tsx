import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "GRE Prep — Ace the Test",
  description: "Full-length GRE practice with Verbal, Quantitative, and Analytical Writing sections.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
