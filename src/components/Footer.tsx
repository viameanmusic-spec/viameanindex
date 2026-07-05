"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-seam mt-24">
      <div className="mx-auto max-w-page px-6 lg:px-10 py-16 grid gap-12 md:grid-cols-3">
        <div>
          <Image
            src="/logo-white.webp"
            alt="Viamean Production"
            width={132}
            height={71}
            className="h-10 w-auto mb-5"
          />
          <p className="text-ash text-sm leading-relaxed max-w-xs">
            İstanbul merkezli yapım şirketi. Fikri kameraya, kamerayı ekrana
            dönüştürüyoruz — çekimden yazılıma her karesi bizde.
          </p>
        </div>

        <div className="text-sm">
          <p className="label text-tungsten mb-5">İletişim</p>
          <ul className="space-y-3 text-ash">
            <li>
              <a href="tel:+905550323422" className="hover:text-bone transition-colors">
                +90 555 032 34 22
              </a>
            </li>
            <li>
              <a href="mailto:info@viamean.com" className="hover:text-bone transition-colors">
                info@viamean.com
              </a>
            </li>
            <li>
              Karadeniz Mah. 1160. Sk. No: 31
              <br />
              34250 Gaziosmanpaşa / İstanbul
            </li>
            <li>Pzt–Cmt · 10:00 – 19:00</li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="label text-tungsten mb-5">Keşfet</p>
          <ul className="space-y-3">
            {[
              ["/hizmetler", "Hizmetler"],
              ["/paketler", "Paketler"],
              ["/isler", "İşlerimiz & Referanslar"],
              ["/ekip", "Ekibimiz"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-ash hover:text-bone transition-colors">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://viameanmusic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ash hover:text-tungsten transition-colors"
              >
                Viamean Music ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="lightline" />
      <div className="mx-auto max-w-page px-6 lg:px-10 py-6 flex flex-wrap gap-4 items-center justify-between">
        <p className="label text-ash">© {new Date().getFullYear()} Viamean Production</p>
        <p className="label text-ash/60">İstanbul · TR</p>
      </div>
    </footer>
  );
}
