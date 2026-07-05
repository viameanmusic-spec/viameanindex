"use client";

import { useMemo, useState } from "react";
import SpotCard from "@/components/SpotCard";
import type { Business, Service } from "@/lib/data";

const WEB_SLUG = "kurumsal-web-site";

export default function PortfolioExplorer({
  businesses,
  services,
}: {
  businesses: Business[];
  services: Service[];
}) {
  const [tab, setTab] = useState<string>("hepsi");
  const [lightbox, setLightbox] = useState<Business | null>(null);

  const websites = useMemo(
    () => businesses.filter((b) => b.services.some((s) => s.slug === WEB_SLUG)),
    [businesses]
  );

  // Sadece işi olan kategorileri sekme yap
  const tabs = useMemo(() => {
    const used = services.filter(
      (s) =>
        s.slug !== WEB_SLUG &&
        businesses.some((b) => b.services.some((bs) => bs.id === s.id))
    );
    return used;
  }, [services, businesses]);

  const filtered = useMemo(() => {
    if (tab === "hepsi") return businesses;
    if (tab === "web") return websites;
    return businesses.filter((b) => b.services.some((s) => s.slug === tab));
  }, [tab, businesses, websites]);

  if (businesses.length === 0) {
    return (
      <div className="border border-seam p-16 text-center">
        <p className="display text-2xl display-outline mb-4">Yakında</p>
        <p className="text-ash text-sm">İlk işler bu rafa yerleşmek üzere.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Sekmeler */}
      <div className="flex flex-wrap gap-2 border-b border-seam pb-6">
        <TabBtn active={tab === "hepsi"} onClick={() => setTab("hepsi")}>
          Hepsi ({businesses.length})
        </TabBtn>
        {websites.length > 0 && (
          <TabBtn active={tab === "web"} onClick={() => setTab("web")}>
            Web Siteleri ({websites.length})
          </TabBtn>
        )}
        {tabs.map((s) => (
          <TabBtn key={s.id} active={tab === s.slug} onClick={() => setTab(s.slug)}>
            {s.name}
          </TabBtn>
        ))}
      </div>

      {/* Web siteleri sekmesi: URL vurgulu kartlar */}
      {tab === "web" ? (
        <div className="grid gap-6 md:grid-cols-2 mt-10">
          {filtered.map((b) => (
            <SpotCard key={b.id} className="group">
              <a
                href={b.website_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <MediaCover b={b} tall />
                <div className="p-7 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-lg">{b.name}</p>
                    {b.sector && <p className="text-ash text-sm mt-1">{b.sector}</p>}
                  </div>
                  {b.website_url && (
                    <span className="label text-tungsten shrink-0">
                      Siteyi Aç ↗
                    </span>
                  )}
                </div>
              </a>
            </SpotCard>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-10">
          {filtered.map((b) => (
            <SpotCard key={b.id} className="group cursor-pointer" >
              <button className="block w-full text-left" onClick={() => setLightbox(b)}>
                <MediaCover b={b} />
                <div className="p-6">
                  <p className="font-semibold">{b.name}</p>
                  <p className="label text-tungsten mt-2 leading-relaxed">
                    {b.services.map((s) => s.name).join(" · ")}
                  </p>
                </div>
              </button>
            </SpotCard>
          ))}
        </div>
      )}

      {/* Lightbox: işin detayı + medya galerisi */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-sm overflow-y-auto"
          onClick={() => setLightbox(null)}
        >
          <div
            className="mx-auto max-w-4xl px-6 py-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6 mb-8">
              <div>
                <h2 className="display text-3xl lg:text-5xl">{lightbox.name}</h2>
                {lightbox.sector && (
                  <p className="label text-ash mt-3">{lightbox.sector}</p>
                )}
                <p className="label text-tungsten mt-3 leading-relaxed">
                  {lightbox.services.map((s) => s.name).join(" · ")}
                </p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="btn !px-4 !py-2 shrink-0"
                aria-label="Kapat"
              >
                Kapat ✕
              </button>
            </div>

            {lightbox.description && (
              <p className="text-ash leading-relaxed mb-10 max-w-2xl">
                {lightbox.description}
              </p>
            )}

            {lightbox.website_url && (
              <a
                href={lightbox.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn mb-10"
              >
                Web Sitesini Aç ↗
              </a>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {lightbox.media.map((m) =>
                m.type === "video" ? (
                  <video
                    key={m.id}
                    src={m.file_path}
                    controls
                    playsInline
                    className="w-full border border-seam"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={m.id}
                    src={m.file_path}
                    alt={m.caption || lightbox.name}
                    className="w-full border border-seam"
                  />
                )
              )}
              {lightbox.media.length === 0 && lightbox.cover_path && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lightbox.cover_path}
                  alt={lightbox.name}
                  className="w-full border border-seam"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`label px-4 py-2.5 border transition-colors ${
        active
          ? "border-tungsten text-tungsten"
          : "border-seam text-ash hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}

function MediaCover({ b, tall = false }: { b: Business; tall?: boolean }) {
  const cover = b.cover_path || b.media.find((m) => m.type === "image")?.file_path;
  const video = !cover ? b.media.find((m) => m.type === "video")?.file_path : null;

  return (
    <div className={`${tall ? "aspect-video" : "aspect-[4/3]"} overflow-hidden bg-ink`}>
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt={b.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : video ? (
        <video src={video} muted playsInline className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <span className="display display-outline text-4xl">{b.name.slice(0, 2)}</span>
        </div>
      )}
    </div>
  );
}
