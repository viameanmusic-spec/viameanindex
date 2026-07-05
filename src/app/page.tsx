import Link from "next/link";
import Reveal from "@/components/Reveal";
import SpotCard from "@/components/SpotCard";
import { getBusinesses, type Business } from "@/lib/data";

export const dynamic = "force-dynamic";

const produksiyon = [
  ["Ürün / Mekân / Model Çekimi", "Markanı en doğru ışıkta gösteren profesyonel çekimler."],
  ["Tanıtım Filmi", "Konsept, senaryo, storyboard ve montaj — markanın ana fragmanı."],
  ["Klip", "Kurgudan renk düzenlemeye uçtan uca müzik videosu."],
  ["Kayıt", "Vokal ve enstrüman için kontrollü stüdyo ortamı."],
  ["Mix & Mastering", "Her platformda profesyonel duyulan ses işçiliği."],
];

const dijital = [
  ["Kurumsal Web Site", "Hızlı, modern ve SEO uyumlu web siteleri."],
  ["QR Menü Sistemleri", "Tek karekodla açılan, panelden yönetilen dijital menü."],
  ["Sosyal Medya Yönetimi", "İçerikten reklam optimizasyonuna uçtan uca yönetim."],
  ["SEO · Mobil · Özel Yazılım", "Arama görünürlüğü, mobil uygulama ve iş akışına özel panel."],
];

const surec = [
  {
    no: "01",
    title: "Brief & Keşif",
    desc: "Projeyi dinliyoruz: hedef kim, mesaj ne, nerede yayınlanacak. Gerekirse mekâna gelip keşif yapıyoruz.",
  },
  {
    no: "02",
    title: "Konsept & Plan",
    desc: "Senaryo, storyboard, moodboard veya site mimarisi — sahaya çıkmadan her karar masada verilir.",
  },
  {
    no: "03",
    title: "Üretim",
    desc: "Çekim, kayıt, tasarım, kod. Set de stüdyo da panel de bizde; ara katman yok, kayıp yok.",
  },
  {
    no: "04",
    title: "Teslim & Yayın",
    desc: "Kurgu, renk, mix, deploy. İş yayına girer, ilk günün performansını birlikte izleriz.",
  },
];

const nedenBiz = [
  {
    title: "Tek Çatı",
    desc: "Çekimi bir ajansa, siteyi başka bir firmaya, sosyal medyayı üçüncüsüne anlatmazsın. Hepsi aynı masada üretilir, marka her yerde aynı dili konuşur.",
  },
  {
    title: "Set + Yazılım Aynı Ekipte",
    desc: "Kamerayı tutan elle kodu yazan el aynı standarda çalışır. Tanıtım filmin sitene, siten QR menüne, menün sosyal medyana bağlanır.",
  },
  {
    title: "Kısa Mesafe",
    desc: "Brief'i alan kişi işi teslim eden kişidir. Aracı yok, telefon zinciri yok — karar hızlı, revize hızlı.",
  },
  {
    title: "İstanbul'da, Sahada",
    desc: "Gaziosmanpaşa'daki stüdyomuzdan tüm İstanbul'a çıkıyoruz. Mekân çekimi, drone, saha prodüksiyonu dahil.",
  },
];

export default async function Home() {
  let businesses: Business[] = [];
  try {
    businesses = await getBusinesses();
  } catch {
    businesses = [];
  }
  const recent = businesses.slice(0, 3);
  const names = businesses.map((b) => b.name);

  return (
    <>
      {/* ————— HERO ————— */}
      <section className="spot-hero relative overflow-hidden">
        <div className="mx-auto max-w-page px-6 lg:px-10 pt-24 pb-28 lg:pt-36 lg:pb-36">
          <Reveal>
            <p className="label text-tungsten mb-8">
              İstanbul · Yapım Şirketi · Prodüksiyon + Dijital
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="display text-[13vw] lg:text-[7.5rem]">
              Işığı Açıyoruz.
              <br />
              <span className="display-outline">Gerisi Kayıtta.</span>
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-10 max-w-xl text-ash text-lg leading-relaxed">
              Viamean bir yapım şirketi. Tanıtım filminden klibe, kayıttan
              mastering&apos;e; web sitesinden sosyal medyaya — markanın sesi ve
              görüntüsü tek çatıda üretilir.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/iletisim" className="btn btn-solid">
                Proje Başlat →
              </Link>
              <Link href="/isler" className="btn">
                İşlerimizi Gör
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ————— REFERANS ŞERİDİ ————— */}
      {names.length > 0 && (
        <div className="border-y border-seam py-8 overflow-hidden">
          <div className="marquee">
            {[0, 1].map((n) => (
              <div key={n} className="marquee-track" aria-hidden={n === 1}>
                {names.map((name) => (
                  <span key={`${n}-${name}`} className="flex items-center gap-16 whitespace-nowrap">
                    <span className="display text-xl text-ash">{name}</span>
                    <span className="text-tungsten">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ————— İKİ DİSİPLİN ————— */}
      <section className="mx-auto max-w-page px-6 lg:px-10 py-24 lg:py-32">
        <Reveal>
          <p className="label text-ash mb-4">Ne yapıyoruz</p>
          <h2 className="display text-4xl lg:text-6xl mb-16">
            İki Disiplin, <span className="text-tungsten">Tek Ekip</span>
          </h2>
        </Reveal>

        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <div className="flex items-baseline justify-between mb-8">
                <h3 className="display text-2xl">Prodüksiyon &amp; Müzik</h3>
                <span className="label text-tungsten">Set + Stüdyo</span>
              </div>
            </Reveal>
            <div className="space-y-3">
              {produksiyon.map(([name, desc], i) => (
                <Reveal key={name} delay={i * 60}>
                  <SpotCard className="p-6">
                    <p className="font-semibold mb-1">{name}</p>
                    <p className="text-ash text-sm">{desc}</p>
                  </SpotCard>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <Reveal>
              <div className="flex items-baseline justify-between mb-8">
                <h3 className="display text-2xl">Dijital &amp; Yazılım</h3>
                <span className="label text-tungsten">Web + Panel</span>
              </div>
            </Reveal>
            <div className="space-y-3">
              {dijital.map(([name, desc], i) => (
                <Reveal key={name} delay={i * 60}>
                  <SpotCard className="p-6">
                    <p className="font-semibold mb-1">{name}</p>
                    <p className="text-ash text-sm">{desc}</p>
                  </SpotCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <Reveal>
          <div className="mt-14">
            <Link href="/hizmetler" className="btn">
              Tüm Hizmetler →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ————— SÜREÇ ————— */}
      <div className="lightline" />
      <section className="mx-auto max-w-page px-6 lg:px-10 py-24 lg:py-32">
        <Reveal>
          <p className="label text-ash mb-4">Süreç</p>
          <h2 className="display text-4xl lg:text-6xl mb-4">
            Brief&apos;ten <span className="display-outline">Yayına</span>
          </h2>
          <p className="text-ash max-w-lg mb-16">
            Her projede aynı dört adım. Sürprizi işin kendisine saklıyoruz,
            sürece değil.
          </p>
        </Reveal>
        <div className="grid gap-px bg-seam md:grid-cols-2 lg:grid-cols-4 border border-seam">
          {surec.map((s, i) => (
            <Reveal key={s.no} delay={i * 80} className="bg-ink">
              <div className="p-8 h-full">
                <p className="display display-outline text-5xl mb-6">{s.no}</p>
                <p className="font-semibold text-lg mb-3">{s.title}</p>
                <p className="text-ash text-sm leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ————— SON İŞLER ————— */}
      {recent.length > 0 && (
        <>
          <div className="lightline" />
          <section className="mx-auto max-w-page px-6 lg:px-10 py-24 lg:py-32">
            <Reveal>
              <p className="label text-ash mb-4">Sahadan</p>
              <h2 className="display text-4xl lg:text-6xl mb-16">
                Son <span className="display-outline">İşler</span>
              </h2>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {recent.map((b, i) => (
                <Reveal key={b.id} delay={i * 80}>
                  <SpotCard className="group">
                    <div className="aspect-[4/3] overflow-hidden bg-coal">
                      {b.cover_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={b.cover_path}
                          alt={b.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <span className="display-outline display text-3xl">
                            {b.name.slice(0, 2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="font-semibold">{b.name}</p>
                      <p className="label text-tungsten mt-2">
                        {b.services.map((s) => s.name).slice(0, 2).join(" · ")}
                      </p>
                    </div>
                  </SpotCard>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="mt-14">
                <Link href="/isler" className="btn">
                  Tüm İşleri Gör →
                </Link>
              </div>
            </Reveal>
          </section>
        </>
      )}

      {/* ————— NEDEN VIAMEAN ————— */}
      <div className="lightline" />
      <section className="mx-auto max-w-page px-6 lg:px-10 py-24 lg:py-32">
        <Reveal>
          <p className="label text-ash mb-4">Neden Viamean</p>
          <h2 className="display text-4xl lg:text-6xl mb-16">
            Ajans Değil, <span className="text-tungsten">Yapım Şirketi</span>
          </h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {nedenBiz.map((n, i) => (
            <Reveal key={n.title} delay={i * 70}>
              <SpotCard className="p-8 h-full">
                <p className="font-semibold text-lg mb-3">{n.title}</p>
                <p className="text-ash text-sm leading-relaxed">{n.desc}</p>
              </SpotCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ————— PAKET TEASER ————— */}
      <div className="lightline" />
      <section className="mx-auto max-w-page px-6 lg:px-10 py-24 lg:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
            <div>
              <p className="label text-ash mb-4">Aylık Paketler</p>
              <h2 className="display text-4xl lg:text-6xl">
                Sosyal Medyayı
                <br />
                <span className="display-outline">Bize Bırak</span>
              </h2>
            </div>
            <Link href="/paketler" className="btn">
              Paketleri Karşılaştır →
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Başlangıç", "Start", "Düzenli içerik ve kurumsal görünürlük için ilk adım. 10 post, 5 reels, aylık çekim."],
            ["İvme", "Boost · En çok tercih edilen", "Prodüksiyonlu reels, ayda 2 çekim ve Meta reklam yönetimiyle büyüme vitesi."],
            ["Zirve", "Elite / Prime", "Drone çekimi, Google Ads ve kurumsal web sitesi dahil — tam kapsam."],
          ].map(([name, tag, desc], i) => (
            <Reveal key={name} delay={i * 80}>
              <Link href="/paketler" className="block h-full">
                <SpotCard className={`p-8 h-full ${i === 1 ? "!border-tungsten/50" : ""}`}>
                  <p className="label text-tungsten mb-4">{tag}</p>
                  <p className="display text-2xl mb-4">Viamean {name}</p>
                  <p className="text-ash text-sm leading-relaxed">{desc}</p>
                </SpotCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ————— CTA ————— */}
      <div className="lightline" />
      <section className="spot-hero">
        <div className="mx-auto max-w-page px-6 lg:px-10 py-28 text-center">
          <Reveal>
            <h2 className="display text-4xl lg:text-7xl">
              Sıradaki Kare <span className="text-tungsten">Senin</span>
            </h2>
            <p className="text-ash mt-6 max-w-md mx-auto">
              Projeyi anlat, çekim planını ve teklifi biz çıkaralım.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link href="/iletisim" className="btn btn-solid">
                İletişime Geç →
              </Link>
              <a href="tel:+905550323422" className="btn">
                +90 555 032 34 22
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
