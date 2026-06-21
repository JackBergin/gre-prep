import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import "../styles/art.css";
import "../styles/glass.css";
import "../styles/logo.css";
import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";
import { site } from "@/lib/site";
import {
  organizationSchema,
  websiteSchema,
  webApplicationSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Free GRE Practice`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [...site.keywords],
  authors: [{ name: site.author }],
  creator: site.author,
  category: "education",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Free GRE Practice`,
    description: site.shortDescription,
    url: site.url,
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Free GRE Practice`,
    description: site.shortDescription,
    site: site.twitterHandle,
    creator: site.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E0E5EC" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1D24" },
  ],
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
        <JsonLd
          data={[organizationSchema(), websiteSchema(), webApplicationSchema()]}
        />
        <Header />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
