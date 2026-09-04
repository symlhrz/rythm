import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Progress Tracker",
  description: "Track your daily activities and progress",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
        <NavBar />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
