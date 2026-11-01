import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Krishi-Line — Transparent Procurement, Stronger Farmers",
  description: "Student prototype: Nashik-model onion procurement with slot booking, QR tokens, land-record checks, digital receipts and payment tracking. Demo data only.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-emerald-50/60 text-gray-900">
        <StoreProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </StoreProvider>
      </body>
    </html>
  );
}
