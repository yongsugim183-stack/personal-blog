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
        <div className="flex-1 bg-slate-100 dark:bg-gray-900 py-10 px-4">
          <main className="max-w-3xl mx-auto bg-white dark:bg-gray-950 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 px-8 py-10 min-h-[60vh]">
            {children}
          </main>
        </div>
        <footer className="bg-slate-100 dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 py-6 text-center text-sm text-gray-400">
          © 2026 김용수. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
