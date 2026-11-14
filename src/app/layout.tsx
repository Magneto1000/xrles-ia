import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Merriweather } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["500", "700", "800"],
});

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Xrles.ia | Conversor Editorial de PDF para MP3 com IA",
  description: "Plataforma N-Tier para conversão de livros e artigos acadêmicos em audiobooks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${jakarta.variable} ${merriweather.variable} font-sans bg-gray-50 text-black antialiased overflow-x-hidden min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}