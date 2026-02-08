import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Player Data Dashboard",
  description: "A modern, responsive dashboard for exploring player statistics from the tofgm-database.",
  openGraph: {
    title: "Player Data Dashboard",
    description: "Explore player statistics, crew rankings, and regional activity.",
    url: "https://nanyinsbedroom.github.io",
    siteName: "Player Dashboard",
    images: [{ url: "https://raw.githubusercontent.com/nanyinsbedroom/nanyinsbedroom.github.io/main/public/og-image.png", width: 1200, height: 630, alt: "Dashboard Preview" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Player Data Dashboard",
    description: "Explore player statistics, crew rankings, and regional activity.",
    images: ["https://raw.githubusercontent.com/nanyinsbedroom/nanyinsbedroom.github.io/main/public/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};