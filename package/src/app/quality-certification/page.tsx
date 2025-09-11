"use client";

import React from "react";

// ===== Badges-only page (secondary images + captions) =====
// เพิ่ม hero full-bleed + ระยะห่างด้านบน

type Badge = {
  id: string;
  title: string;
  desc?: string;
  src: string;
  box?: [number, number]; // pixel box (w,h). Default 414x240
};

function publicUrl(p: string) {
  return p.startsWith("/") ? p : `/${p}`;
}

// ⬇️ ใส่รูป 1819x826 ไว้ใต้ /public/images/certifications/
const HERO_SRC = "images/certifications/awards-1819x826.png";
const HERO_ALT = "TPP Awards & Certifications";

const BADGES: Badge[] = [
  {
    id: "iso9001-ukas",
    title: "QMS — ISO 9001 : 2015",
    desc: "UKAS / SGS System Certification",
    src: "images/certifications/iso9001-ukas.png",
    box: [414, 240],
  },
  {
    id: "iso14001-ukas",
    title: "EMS — ISO 14001 : 2015",
    desc: "UKAS / SGS System Certification",
    src: "images/certifications/iso14001-ukas.png",
    box: [414, 240],
  },
  {
    id: "ghp-badge",
    title: "GHP — Good Hygiene Practice",
    desc: "ACFS Thailand Accreditation",
    src: "images/certifications/ghp-badge.png",
    box: [414, 240],
  },
  {
    id: "haccp-badge",
    title: "HACCP — Hazard Analysis Critical Control Point",
    desc: "ACFS Thailand Accreditation",
    src: "images/certifications/haccp-badge.png",
    box: [414, 240],
  },
  {
    id: "sgsco-badge",
    title: "SGS&CO — Certified Print Facility",
    desc: "Graphic Measures International",
    src: "images/certifications/sgsco-badge.png",
    box: [392, 267],
  },
  {
    id: "fsc-badge",
    title: "FSC — Forest Stewardship Council (CoC)",
    desc: "Chain of Custody",
    src: "images/certifications/fsc-badge.png",
    box: [414, 240],
  },
  {
    id: "green-industry-badge",
    title: "Green Industry — Level 3",
    desc: "กระทรวงอุตสาหกรรม (Green System)",
    src: "images/certifications/green-industry-badge.png",
    box: [494, 170],
  },
];

function FullBleedHero({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
      <img
        src={publicUrl(src)}
        alt={alt}
        className="block w-screen h-auto" // รักษาสัดส่วน, เต็มความกว้างจอ
        loading="eager"
      />
    </div>
  );
}

export default function QualityBadgesOnlyPage() {
  return (
    // เพิ่ม pt ให้ห่างโลโก้/เฮดเดอร์มากขึ้น (ปรับตัวเลขได้)
    <main className="min-h-screen bg-white pt-20 md:pt-24 flex flex-col">
      {/* HERO เต็มจอแบบไม่เสียทรง */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <header className="text-center mt-10 md:mt-14">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900">
            การรับรองคุณภาพ : ตราสัญลักษณ์ (Badges)
          </h1>
          <p className="mt-3 text-neutral-600">
            แสดงเฉพาะตราสัญลักษณ์การรับรอง (secondary images)
            พร้อมคำอธิบายใต้รูป
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BADGES.map((b) => (
            <figure
              key={b.id}
              className="rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition p-4">
              <div
                className="mx-auto w-full bg-white rounded-xl ring-1 ring-neutral-200 overflow-hidden"
                style={{
                  // กล่องโชว์โลโก้: ยังคงสัดส่วนเดิมของแต่ละ badge
                  aspectRatio: `${b.box?.[0] ?? 414} / ${b.box?.[1] ?? 240}`,
                  maxWidth: b.box?.[0] ?? 414,
                }}>
                <img
                  src={publicUrl(b.src)}
                  alt={b.title}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </div>
              <figcaption className="mt-3 text-center">
                <div className="font-semibold text-neutral-900">{b.title}</div>
                {b.desc && (
                  <div className="text-sm text-neutral-600">{b.desc}</div>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <div className="mt-auto relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <img
          src={publicUrl("images/certifications/awards-collage.png")}
          alt="TPP Awards & Certifications"
          width={1819}
          height={826}
          className="block w-screen h-auto max-w-none"
          loading="lazy"
        />
      </div>
    </main>
  );
}
