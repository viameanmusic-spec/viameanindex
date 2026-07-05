"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/paketler", label: "Paketler" },
  { href: "/isler", label: "İşlerimiz" },
  { href: "/ekip", label: "Ekibimiz" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-seam bg-ink/85 backdrop-blur-md">
      <div className="mx-auto max-w-page px-6 lg:px-10 h-[72px] flex items-center justify-between">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Image
            src="/logo-white.webp"
            alt="Viamean Production"
            width={132}
            height={71}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`label transition-colors ${
                pathname === l.href ? "text-tungsten" : "text-ash hover:text-bone"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/iletisim" className="btn btn-solid !py-2.5 !px-5">
            Proje Başlat
          </Link>
        </nav>

        <button
          className="md:hidden label text-bone"
          onClick={() => setOpen(!open)}
          aria-label="Menü"
        >
          {open ? "Kapat" : "Menü"}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-seam bg-ink px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`label ${pathname === l.href ? "text-tungsten" : "text-ash"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
