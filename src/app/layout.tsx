import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "../styles/art.css";
import "../styles/glass.css";
import "../styles/logo.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "PrismPrep — Focused GRE Practice",
  description:
    "Break complex GRE prep into clear, focused paths. Full-length Verbal, Quantitative, and Analytical Writing practice with instant scoring.",
};

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored === 'dark' || stored === 'light' ? stored : (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
