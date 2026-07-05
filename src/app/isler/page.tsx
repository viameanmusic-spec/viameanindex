import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { getBusinesses, getServices } from "@/lib/data";
import PortfolioExplorer from "@/components/PortfolioExplorer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yaptığımız İşler — Viamean Production",
  description: "Çekimden yazılıma, teslim ettiğimiz işler.",
};

export default async function Isler() {
  let businesses: Awaited<ReturnType<typeof getBusinesses>> = [];
  let services: Awaited<ReturnType<typeof getServices>> = [];
  try {
    [businesses, services] = await Promise.all([getBusinesses(), getServices()]);
  } catch {
    // DB henüz kurulmadıysa boş göster
  }

  return (
    <div className="mx-auto max-w-page px-6 lg:px-10 py-20 lg:py-28">
      <Reveal>
        <p className="label text-tungsten mb-4">Portfolyo</p>
        <h1 className="display text-5xl lg:text-8xl">
          Yaptığımız
          <br />
          <span className="display-outline">İşler.</span>
        </h1>
        <p className="text-ash mt-8 max-w-lg text-lg">
          Konuşmak yerine gösteriyoruz. Web siteleri ayrı rafta; çekim, klip ve
          diğer işler hizmetine göre filtrelenir.
        </p>
      </Reveal>

      <div className="mt-16">
        <PortfolioExplorer businesses={businesses} services={services} />
      </div>
    </div>
  );
}
