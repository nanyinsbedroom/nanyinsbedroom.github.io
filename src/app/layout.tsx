import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Player Data Dashboard",
  description: "A modern dashboard for exploring player statistics with interactive charts and graphs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Changed main element styles for scrolling */}
        <main style={{ padding: '2rem', minHeight: '100vh', width: '100%' }}>
          {children}
        </main>
      </body>
    </html>
  );
}