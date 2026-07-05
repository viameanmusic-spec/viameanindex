import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SpotCard from "@/components/SpotCard";
import { getTeam } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ekibimiz — Viamean Production",
  description: "Setin arkasındaki, panelin başındaki ekip.",
};

export default async function Ekip() {
  let team: Awaited<ReturnType<typeof getTeam>> = [];
  try {
    team = await getTeam();
  } catch {}

  return (
    <div className="mx-auto max-w-page px-6 lg:px-10 py-20 lg:py-28">
      <Reveal>
        <p className="label text-tungsten mb-4">Ekip</p>
        <h1 className="display text-5xl lg:text-8xl">
          Kameranın
          <br />
          <span className="display-outline">Arkasındakiler.</span>
        </h1>
        <p className="text-ash mt-8 max-w-lg text-lg">
          Küçük ekip, kısa mesafe: brief&apos;i alan kişiyle işi teslim eden kişi
          aynı masada oturur.
        </p>
      </Reveal>

      {team.length === 0 ? (
        <Reveal>
          <div className="border border-seam p-16 text-center mt-16">
            <p className="display text-2xl display-outline mb-4">Yakında</p>
            <p className="text-ash text-sm">Ekip kartları hazırlanıyor.</p>
          </div>
        </Reveal>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-16">
          {team.map((m, i) => (
            <Reveal key={m.id} delay={(i % 3) * 70}>
              <SpotCard className="group h-full">
                <div className="aspect-[4/5] overflow-hidden bg-ink">
                  {m.photo_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.photo_path}
                      alt={m.name}
                      className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="display display-outline text-5xl">
                        {m.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="font-semibold text-lg">{m.name}</p>
                  <p className="label text-tungsten mt-2">{m.role}</p>
                  {m.bio && (
                    <p className="text-ash text-sm mt-4 leading-relaxed">{m.bio}</p>
                  )}
                </div>
              </SpotCard>
            </Reveal>
          ))}
        </div>
      )}

      <Reveal>
        <div className="mt-20 text-center">
          <p className="text-ash mb-6">Bu ekiple çalışmak ister misin?</p>
          <Link href="/iletisim" className="btn btn-solid">
            Proje Başlat →
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
