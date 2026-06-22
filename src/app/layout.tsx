import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduPulse AI — Classroom Optimization Planner",
  description: "Advanced diagnostic grouping and student microplanning helper.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
