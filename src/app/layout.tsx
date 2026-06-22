import type { Metadata } from "next";
import { Sora, DM_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "EduPulse AI",
  description: "Advanced diagnostic grouping and student microplanning helper.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", dmSans.variable, sora.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

