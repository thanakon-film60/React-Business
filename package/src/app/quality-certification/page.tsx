"use client";

import React, { useEffect, useMemo, useState } from "react";

// ---------- Types ----------
type CertLayout = "card" | "banner";
interface CertItem {
  id: string;
  title: string;
  subtitle?: string;
  tags: string[];
  year?: string;
  primary: string;
  secondary?: string;
  captionLines?: string[];
  href?: string;
  primaryBox?: [number, number];
  secondaryBox?: [number, number];
  layout?: CertLayout;
}

// ---------- Data (examples) ----------
const CERTS: CertItem[] = [
  {
    id: "iso9001",
    title: "ISO 9001 : 2015",
    subtitle: "Quality Management System (QMS)",
    tags: ["ISO", "Quality"],
    year: "2015",
    primary: "images/certifications/iso9001.jpg",
    secondary: "images/certifications/iso9001-ukas.png",
    captionLines: ["QMS :", "Quality Management System", "9001 : 2015"],
    primaryBox: [549, 783],
    secondaryBox: [414, 240],
  },
  {
    id: "iso14001",
    title: "ISO 14001 : 2015",
    subtitle: "Environmental Management System (EMS)",
    tags: ["ISO", "Environment"],
    year: "2015",
    primary: "images/certifications/iso14001.jpg",
    secondary: "images/certifications/iso14001-ukas.png",
    captionLines: ["EMS :", "Environmental Management System", "14001 : 2015"],
    primaryBox: [549, 783],
    secondaryBox: [414, 240],
  },
  {
    id: "ghp",
    title: "GHP : Good Hygiene Practice",
    tags: ["Food Safety"],
    primary: "images/certifications/ghp.jpg",
    secondary: "images/certifications/ghp-badge.png",
    captionLines: ["GHP :", "Good Hygiene Practice"],
    primaryBox: [549, 783],
    secondaryBox: [414, 240],
  },
  {
    id: "haccp",
    title: "HACCP : Hazard Analysis Critical Control Point",
    tags: ["Food Safety"],
    primary: "images/certifications/haccp.jpg",
    secondary: "images/certifications/haccp-badge.png",
    captionLines: ["HACCP :", "Hazard Analysis Critical", "Control Point"],
    primaryBox: [549, 783],
    secondaryBox: [414, 240],
  },
  // --- Custom sized cards requested ---
  {
    id: "fsc",
    title: "FSC : Forest Stewardship Council (CoC)",
    tags: ["Environment", "Sustainability"],
    primary: "images/certifications/fsc.jpg",
    captionLines: ["FSC :", "Forest Stewardship Council"],
    primaryBox: [549, 783],
  },
  {
    id: "gmi",
    title: "GMI – Certified Print Facility",
    tags: ["Quality", "Awards"],
    primary: "images/certifications/gmi.jpg",
    secondary: "images/certifications/sgsco-badge.png",
    captionLines: [
      "Graphic Measures International",
      "Certified Print Facility",
    ],
    primaryBox: [712, 503],
    secondaryBox: [392, 267],
  },
  {
    id: "green-industry",
    title: "Green Industry – Level 3",
    tags: ["Environment"],
    primary: "images/certifications/green-industry.jpg",
    secondary: "images/certifications/green-industry-badge.png",
    captionLines: ["Green Industry", "Level 3"],
    primaryBox: [535, 760],
    secondaryBox: [494, 170],
  },
  // --- Full-width banner (1819×826) ---
  {
    id: "awards-banner",
    title: "Awards & Recognitions",
    tags: ["Awards"],
    primary: "images/certifications/awards-collage.png",
    captionLines: [],
    primaryBox: [1819, 826],
    layout: "banner",
  },
];

const ALL_TAG = "All" as const;
const TAGS_ORDER = [
  ALL_TAG,
  "ISO",
  "Food Safety",
  "Environment",
  "Quality",
  "Awards",
  "Compliance",
  "Sustainability",
] as const;

// ---------- Helpers ----------
function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

// ---------- Lightbox (shows primary image) ----------
const Lightbox: React.FC<{
  items: CertItem[];
  index: number;
  onClose: () => void;
}> = ({ items, index, onClose }) => {
  const [i, setI] = useState(index);
  const item = items[i];
  const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
  React.useEffect(() => {
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal>
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full ring-1 ring-white/20 text-white/80 hover:text-white px-3 py-1 text-sm">
        ESC
      </button>
      <button
        onClick={() => setI((i - 1 + items.length) % items.length)}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-3xl"
        aria-label="Previous">
        ‹
      </button>
      <figure className="max-w-[min(1200px,95vw)] max-h-[85vh] w-full">
        <img
          src={item.primary}
          alt={item.title}
          className="w-full h-full object-contain select-none"
        />
        <figcaption className="text-white/90 text-center mt-3">
          <div className="font-medium">{item.title}</div>
          {item.subtitle && (
            <div className="text-sm opacity-90">{item.subtitle}</div>
          )}
        </figcaption>
      </figure>
      <button
        onClick={() => setI((i + 1) % items.length)}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-3xl"
        aria-label="Next">
        ›
      </button>
    </div>
  );
};

// ---------- Card (supports two images + text) ----------
const CertCard: React.FC<{ item: CertItem; onOpen: () => void }> = ({
  item,
  onOpen,
}) => {
  return (
    <article className="group relative mb-6 break-inside-avoid overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 bg-white hover:shadow-xl transition-shadow">
      <div className="p-3">
        <div
          className="relative w-full mx-auto bg-white rounded-xl ring-1 ring-neutral-200 overflow-hidden"
          style={{
            aspectRatio: `${item.primaryBox?.[0] ?? 549} / ${
              item.primaryBox?.[1] ?? 783
            }`,
            maxWidth: item.primaryBox?.[0] ?? 549,
          }}>
          <img
            src={item.primary}
            alt={item.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain"
          />
          <button
            onClick={onOpen}
            aria-label={`Open ${item.title}`}
            className="absolute inset-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/50"
          />
        </div>

        {item.secondary && (
          <div
            className="mt-3 mx-auto bg-white rounded-xl ring-1 ring-neutral-200 overflow-hidden w-full"
            style={{
              aspectRatio: `${item.secondaryBox?.[0] ?? 414} / ${
                item.secondaryBox?.[1] ?? 240
              }`,
              maxWidth: item.secondaryBox?.[0] ?? 414,
            }}>
            <img
              src={item.secondary}
              alt={`${item.title} badge`}
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>
        )}

        {(item.captionLines?.length || item.subtitle || item.title) && (
          <div className="mt-4 text-neutral-800">
            {item.captionLines?.map((t, i) => (
              <p key={i} className="leading-tight">
                {t}
              </p>
            ))}
            {!item.captionLines && (
              <>
                <p className="leading-tight font-medium">{item.title}</p>
                {item.subtitle && (
                  <p className="leading-tight text-sm text-neutral-600">
                    {item.subtitle}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

// Banner full-width (1819×826) keeps aspect ratio
const BannerCert: React.FC<{ item: CertItem; onOpen: () => void }> = ({
  item,
  onOpen,
}) => {
  const w = item.primaryBox?.[0] ?? 1819;
  const h = item.primaryBox?.[1] ?? 826;
  return (
    <section className="my-10">
      <div
        className="relative mx-auto w-full bg-white rounded-2xl ring-1 ring-neutral-200 overflow-hidden"
        style={{ aspectRatio: `${w} / ${h}`, maxWidth: w }}>
        <img
          src={item.primary}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-contain"
        />
        <button
          onClick={onOpen}
          aria-label={`Open ${item.title}`}
          className="absolute inset-0 focus:outline-none"
        />
      </div>
    </section>
  );
};

// ---------- Page ----------
export default function QualityCertificationPage() {
  const [activeTag, setActiveTag] =
    useState<(typeof TAGS_ORDER)[number]>(ALL_TAG);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (activeTag === ALL_TAG) return CERTS;
    return CERTS.filter((c) => c.tags.includes(activeTag as string));
  }, [activeTag]);
  const cardItems = filtered.filter((i) => (i.layout ?? "card") === "card");
  const bannerItems = filtered.filter((i) => i.layout === "banner");
  const ordered = [...cardItems, ...bannerItems];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[url('/images/hero/quality-soft.jpg')] bg-cover bg-center opacity-30" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <p className="text-sm uppercase tracking-widest text-neutral-500">
            Quality & Certifications
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900">
            การรับรองคุณภาพ (Quality Certification)
          </h1>
          <p className="mt-4 max-w-3xl text-neutral-600">
            --------------------------------------------------------
            --------------------------------------------------------
            ----------------------------------------------------
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 border-b border-neutral-100 pb-6">
          {TAGS_ORDER.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={cx(
                "rounded-full px-3.5 py-1.5 text-sm transition",
                activeTag === tag
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
              )}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry gallery */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {cardItems.map((item) => (
            <CertCard
              key={item.id}
              item={item}
              onOpen={() =>
                setLightboxIndex(ordered.findIndex((o) => o.id === item.id))
              }
            />
          ))}
        </div>
      </section>

      {/* Full-width banners */}
      {bannerItems.map((item) => (
        <div key={item.id} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BannerCert
            item={item}
            onOpen={() =>
              setLightboxIndex(ordered.findIndex((o) => o.id === item.id))
            }
          />
        </div>
      ))}

      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </main>
  );
}
