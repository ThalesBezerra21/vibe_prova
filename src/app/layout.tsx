import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibe Prova",
  description: "Crie suas provas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col pt-16 font-sans">
        <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur z-50 flex items-center px-4 md:px-8 shadow-sm">
          <Link href="/" className="font-bold text-xl mr-auto tracking-tight">Vibe Prova</Link>
          <nav className="flex items-center gap-2">
            <Link href="/" className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md">Início</Link>
            <Link href="/provas" className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md">Ver Provas</Link>
            <Link href="/criar" className="px-3 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/95 rounded-md">Criar Prova</Link>
          </nav>
        </header>
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
