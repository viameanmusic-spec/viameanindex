import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SpotCard from "@/components/SpotCard";

export const metadata: Metadata = {
  title: "Hizmetler — Viamean Production",
  description: "Prodüksiyon, müzik, web ve dijital hizmetlerimizin tamamı.",
};

const groups = [
  {
    title: "Prodüksiyon & Müzik",
    tag: "Set + Stüdyo",
    intro:
      "Fikrin kameraya, kameranın ekrana dönüştüğü yer. Çekimden mastering'e her kareyi biz kuruyoruz.",
    items: [
      ["Ürün / Mekân / Model Çekimi", "Markanı en doğru ışıkta gösteren profesyonel stüdyo ve mekân çekimleri."],
      ["Tanıtım Filmi", "Konsept, senaryo, storyboard ve montaj — firmanın ana tanıtım fragmanı. Tek seferlik saha çekimiyle markanın hikâyesini sinematik bir dille anlatıyoruz."],
      ["Klip", "Sanatçılar için kurgudan renk düzenlemeye uçtan uca müzik videosu prodüksiyonu."],
      ["Kayıt", "Vokal ve enstrüman için temiz, kontrollü stüdyo kayıt ortamı."],
      ["Mix & Mastering", "Parçanı her platformda profesyonel duyulacak seviyeye taşıyan ses işçiliği."],
    ],
  },
  {
    title: "Dijital & Yazılım",
    tag: "Web + Panel",
    intro:
      "Markanın çevrimiçi karşılığı. Web'den mobil uygulamaya, QR menüden sosyal medyaya kadar dijital her şey.",
    items: [
      ["Kurumsal Web Site", "Hızlı, modern ve SEO uyumlu, markanı hak ettiği gibi anlatan web siteleri."],
      ["QR Menü Sistemleri", "Kafe ve restoranlar için tek karekodla açılan, panelden yönetilen dijital menü. Baskı maliyeti yok; ürün, görsel ve fiyat güncellemesi saniyeler içinde."],
      ["Sosyal Medya Yönetimi", "İçerik üretiminden reklam optimizasyonuna kadar uçtan uca hesap yönetimi."],
      ["SEO Çalışması", "Arama motorlarında üst sıralara çıkaran teknik ve içerik tabanlı optimizasyon."],
      ["Mobil Uygulama", "iOS ve Android için akıcı, performanslı ve markaya özel mobil deneyimler."],
      ["Özel Yazılım Çözümleri", "İş akışına özel panel, otomasyon ve entegrasyonlarla ölçeklenen yazılımlar."],
    ],
  },
];

export default function Hizmetler() {
  return (
    <div className="mx-auto max-w-page px-6 lg:px-10 py-20 lg:py-28">
      <Reveal>
        <p className="label text-tungsten mb-4">Hizmetler</p>
        <h1 className="display text-5xl lg:text-8xl">
          On Bir Hizmet,
          <br />
          <span className="display-outline">Aynı Standart.</span>
        </h1>
        <p className="text-ash mt-8 max-w-lg text-lg">
          İki disiplin, tek ekip. İşin sahada da ekranda da aynı elden çıkması,
          markanın her yerde aynı dili konuşması demek.
        </p>
      </Reveal>

      {groups.map((g) => (
        <section key={g.title} className="mt-24">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
              <h2 className="display text-3xl lg:text-5xl">{g.title}</h2>
              <span className="label text-tungsten">{g.tag}</span>
            </div>
            <p className="text-ash max-w-xl mb-10">{g.intro}</p>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {g.items.map(([name, desc], i) => (
              <Reveal key={name} delay={i * 50}>
                <SpotCard className="p-7 h-full">
                  <p className="font-semibold text-lg mb-3">{name}</p>
                  <p className="text-ash text-sm leading-relaxed">{desc}</p>
                </SpotCard>
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      <Reveal>
        <div className="mt-24 text-center">
          <p className="text-ash mb-6">Hangi hizmete ihtiyacın olduğundan emin değil misin?</p>
          <Link href="/iletisim" className="btn btn-solid">
            Birlikte Karar Verelim →
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
