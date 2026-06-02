import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { grotesk, mono } from "@/lib/fonts";
import { profile } from "@/lib/data";
import "./globals.css";

const url = "https://souvikmukherjee.dev";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.tagline,
  keywords: [
    "Souvik Mukherjee",
    "quant developer",
    "low-latency",
    "order management system",
    "matching engine",
    "C++",
    "Go",
    "HFT",
    "systems engineer",
    "India",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    url,
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0E14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable}`}>
      <body>
        <a
          href="#work"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-base"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
