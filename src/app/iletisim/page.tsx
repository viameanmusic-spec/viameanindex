import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SpotCard from "@/components/SpotCard";

export const metadata: Metadata = {
  title: "İletişim — Viamean Production",
  description: "Projeyi konuşalım. Telefon, e-posta ve stüdyo adresimiz.",
};

const cards = [
  {
    label: "Telefon",
    value: "+90 555 032 34 22",
    href: "tel:+905550323422",
    hint: "Pzt–Cmt · 10:00 – 19:00",
  },
  {
    label: "E-Posta",
    value: "info@viamean.com",
    href: "mailto:info@viamean.com",
    hint: "Aynı gün dönüş yapıyoruz",
  },
  {
    label: "Stüdyo",
    value: "Karadeniz Mah. 1160. Sk. No: 31, 34250 Gaziosmanpaşa / İstanbul",
    href: "https://maps.google.com/?q=Karadeniz+Mah.+1160.+Sk.+No:+31+Gaziosmanpaşa+İstanbul",
    hint: "Haritada aç ↗",
  },
  {
    label: "Müzik Tarafı",
    value: "viameanmusic.com",
    href: "https://viameanmusic.com",
    hint: "Kayıt · Mix & Mastering ↗",
  },
];

export default function Iletisim() {
  return (
    <div className="mx-auto max-w-page px-6 lg:px-10 py-20 lg:py-28">
      <Reveal>
        <p className="label text-tungsten mb-4">İletişim</p>
        <h1 className="display text-5xl lg:text-8xl">
          Kamera Hazır,
          <br />
          <span className="display-outline">Söz Sende.</span>
        </h1>
        <p className="text-ash mt-8 max-w-lg text-lg">
          Projeyi bir cümleyle anlat, yeter. Konsepti, planı ve teklifi biz çıkaralım.
        </p>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2 mt-16">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 70}>
            <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
              <SpotCard className="p-8 h-full">
                <p className="label text-tungsten mb-4">{c.label}</p>
                <p className="text-xl font-semibold leading-snug">{c.value}</p>
                <p className="text-ash text-sm mt-3">{c.hint}</p>
              </SpotCard>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-16 border border-seam p-8 lg:p-12 spot-hero">
          <p className="display text-2xl lg:text-4xl mb-4">
            Hızlı Teklif İçin
          </p>
          <p className="text-ash max-w-xl mb-8">
            E-postana şu üç bilgiyi ekle: işletmenin adı, ihtiyacın olan hizmet
            ve hedeflediğin tarih. Gerisini biz toparlayalım.
          </p>
          <a
            href="mailto:info@viamean.com?subject=Proje%20Teklifi%20—%20Viamean"
            className="btn btn-solid"
          >
            E-Posta Gönder →
          </a>
        </div>
      </Reveal>
    </div>
  );
}
