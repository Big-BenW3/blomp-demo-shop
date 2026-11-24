import type { Metadata } from "next";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blomp Demo Shop",
  description: "A tiny shop that Blomp and Kane test.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="page">{children}</main>
        <footer className="footer">A demo shop for Blomp. Nothing here is real, no card is ever charged.</footer>
      </body>
    </html>
  );
}
