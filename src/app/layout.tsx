import type { Metadata } from "next";
import { Archivo, Space_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-archivo",
  axes: ["wdth"],
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Viamean Production — Prodüksiyon, Müzik & Dijital Stüdyo",
  description:
    "İstanbul merkezli yapım şirketi. Tanıtım filmi, klip, çekim, kayıt, mix & mastering; web sitesi, QR menü ve sosyal medya yönetimi.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${archivo.variable} ${mono.variable}`}>
      <body className="font-body bg-ink text-bone min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
