import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Paketler — Viamean Production",
  description: "Aylık sosyal medya yönetimi paketleri: Başlangıç, İvme ve Zirve.",
};

const packages = [
  {
    tier: "Start",
    name: "Viamean Başlangıç",
    featured: false,
    items: [
      "10 Özgün Post Tasarımı",
      "5 Reels",
      "15 Story Paylaşımı",
      "Aylık Profesyonel Video / Fotoğraf Çekimi",
      "Kurumsal Kimlik Oluşturma",
      "Hedef Kitle Analizi",
      "Profil Düzenleme (SEO Uyumlu)",
      "Rakip Analizi + Strateji Belirleme",
      "Özel Gün Paylaşımları",
    ],
  },
  {
    tier: "Boost",
    name: "Viamean İvme",
    featured: true,
    items: [
      "15 Özgün Post Tasarımı",
      "10 Reels (Prodüksiyon)",
      "20 Story Paylaşımı",
      "Aylık Profesyonel Video / Fotoğraf Çekimi (2 Kez)",
      "Kurumsal Kimlik Oluşturma",
      "Hedef Kitle Analizi",
      "Profil Düzenleme (SEO Uyumlu)",
      "Rakip Analizi + Strateji Belirleme",
      "Aylık Raporlama",
      "Meta Reklam Yönetimi + Optimizasyon",
      "Özel Gün Paylaşımları",
    ],
  },
  {
    tier: "Elite / Prime",
    name: "Viamean Zirve",
    featured: false,
    items: [
      "15 Özgün Post Tasarımı",
      "10 Reels (Prodüksiyon)",
      "20 Story Paylaşımı",
      "Aylık Profesyonel Video / Fotoğraf Çekimi (3 Kez)",
      "Drone ile Hava Çekimi",
      "Kurumsal Kimlik Oluşturma",
      "Hedef Kitle Analizi",
      "Profil Düzenleme (SEO Uyumlu)",
      "Rakip Analizi + Strateji Belirleme",
      "Aylık Raporlama",
      "Meta Reklam Yönetimi + Optimizasyon",
      "Google Ads Yönetimi",
      "Özel Gün Paylaşımları",
      "Kurumsal Web Sitesi",
    ],
  },
];

export default function Paketler() {
  return (
    <div className="mx-auto max-w-page px-6 lg:px-10 py-20 lg:py-28">
      <Reveal>
        <p className="label text-tungsten mb-4">Paketler · 1 Ay · Sosyal Medya Yönetimi</p>
        <h1 className="display text-5xl lg:text-8xl">
          Markanı Aya
          <br />
          <span className="display-outline">Değil, Aylara Taşı.</span>
        </h1>
        <p className="text-ash mt-8 max-w-lg text-lg">
          Üç seviye, tek hedef: hesabın her ay bir öncekinden daha güçlü kapansın.
          Fiyatlar iş hacmine göre şekillenir — konuşalım.
        </p>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-3 mt-20 items-start">
        {packages.map((p, i) => (
          <Reveal key={p.name} delay={i * 100}>
            <div
              className={`relative border p-8 lg:p-10 ${
                p.featured
                  ? "border-tungsten bg-coal shadow-[0_0_60px_rgba(242,163,60,0.08)]"
                  : "border-seam bg-coal/50"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 right-6 label bg-tungsten text-ink px-3 py-1.5">
                  En Çok Tercih Edilen
                </span>
              )}
              <p className="label text-ash mb-3">{p.tier}</p>
              <h2 className="display text-2xl lg:text-3xl mb-8">{p.name}</h2>
              <ul className="space-y-3.5 text-sm">
                {p.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-tungsten mt-px">—</span>
                    <span className={p.featured ? "text-bone" : "text-ash"}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/iletisim"
                className={`btn mt-10 w-full justify-center ${p.featured ? "btn-solid" : ""}`}
              >
                Fiyat İçin İletişime Geç →
              </Link>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="text-ash text-sm mt-14 max-w-xl">
          Paket içerikleri ihtiyaca göre özelleştirilebilir. Yalnızca çekim,
          yalnızca reklam yönetimi veya proje bazlı çalışmalar için de teklif
          alabilirsin.
        </p>
      </Reveal>
    </div>
  );
}
