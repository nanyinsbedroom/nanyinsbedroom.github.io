import { Sora } from "next/font/google";
import "@/styles/globals.css";
import Providers from "@/components/Providers";

const sora = Sora({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={sora.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}