import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "TerraClean – jäätmete sorteerimise juhend",
  description: "Otsi eset ja vaata, millisesse konteinerisse või kogumispunkti see Eestis kuulub.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et">
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <p className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-slate-700">
            © 2026 TerraClean. Built with Claude Code
          </p>
        </footer>
      </body>
    </html>
  );
}
