import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "@/styles/globals.css";

const sora = Sora({ subsets: ["latin"] });

/**
 * Root metadata for the entire application.
 */
export const metadata: Metadata = {
  title: "Player Data Dashboard",
  description: "A modern, responsive dashboard for exploring player statistics from the tofgm-database.",
  openGraph: {
    title: "Player Data Dashboard",
    description: "Explore player statistics, crew rankings, and regional activity.",
    url: "https://nanyinsbedroom.github.io",
    siteName: "Player Data Dashboard",
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

/**
 * Root viewport configuration for the application.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

/**
 * The root layout component for the application.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={sora.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}