import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "김용수의 블로그",
  description: "개발과 생각을 기록하는 공간",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
          {children}
        </main>
        <footer className="border-t border-gray-100 dark:border-gray-800 py-6 text-center text-sm text-gray-400">
          © 2026 김용수. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
