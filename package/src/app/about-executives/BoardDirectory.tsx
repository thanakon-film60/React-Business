"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
// ถ้าคุณมี Header อยู่แล้วให้ import มาแทนได้เลย
// import Header from "@/components/Header";

// ======= ปรับแต่งได้ =======
const HERO_TITLE = "คณะกรรมการ / ผู้บริหาร";
const HERO_DESC =
  "คณะกรรมการและผู้บริหาร กำหนดวิสัยทัศน์และกลยุทธ์เชิงธุรกิจ เพื่อเสริมสร้างความแข็งแกร่งและความยั่งยืนขององค์กร";
const HERO_BG_URL = "/images/joinus/bg-board.jpg";

// หมวดในแถบแท็บ
const TABS = [
  { id: "board", label: "คณะกรรมการ" },
  // { id: "subcommittee", label: "คณะกรรมการชุดย่อย" },
  { id: "executive", label: "ผู้บริหาร" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export type Member = {
  id: string;
  name: string;
  role?: string;
  image?: string;
  category: TabId;
};

const MEMBERS: Member[] = [
  // === ตัวอย่างชุด "คณะกรรมการ" (12 คน) ===
  {
    id: "m01",
    name: "นายธีระพงษ์ อศัวินวิจิตร",
    role: "ประธานกรรมการ",
    image: "/images/board/User_shadow.png",
    category: "board",
  },
  {
    id: "m02",
    name: "นายฉัตรชัย เอียสกุล",
    role: "รองประธานกรรมการ",
    image: "/images/board/User_shadow.png",
    category: "board",
  },
  {
    id: "m05",
    name: "นายอดลุย์  วินัยแพทย ์",
    role: "กรรมการ",
    image: "/images/board/User_shadow.png",
    category: "board",
  },
  {
    id: "m03",
    name: "ดร.วรัญ แต ้ไพสิฐพงษ",
    role: "ประธานกรรมการสรรหา และกำหนดค่าตอบแทน",
    image: "/images/board/User_shadow.png",
    category: "board",
  },
  {
    id: "m04",
    name: "นายสุนทร พจน์ธนมาศ",
    role: "กรรมการอิสระ ประธานกรรมการตรวจสอบ",
    image: "/images/board/User_shadow.png",
    category: "board",
  },

  {
    id: "m06",
    name: "นายเจริญรตน์ หาญเบญจพงศ์",
    role: "กรรมการอิสระ กรรมการตรวจสอบ",
    image: "/images/board/User_shadow.png",
    category: "board",
  },
  {
    id: "m07",
    name: "นายสุพจน์ พฤกษานานนท์",
    role: "กรรมการ",
    image: "/images/board/User_shadow.png",
    category: "board",
  },
  {
    id: "m08",
    name: "นายจักกพงศ์ ณ บางช้าง",
    role: "กรรมการอิสระ กรรมการตรวจสอบ",
    image: "/images/board/User_shadow.png",
    category: "board",
  },
  {
    id: "m09",
    name: "นายพงศธัช อัศวินวิจิตร",
    role: "กรรมการ และ กรรมการผู้จัดการ",
    image: "/images/board/User_shadow.png",
    category: "board",
  },
  {
    id: "m10",
    name: "นายอดุม นิลภารักษ์",
    role: "กรรมการ",
    image: "/images/board/User_shadow.png",
    category: "board",
  },
  {
    id: "m11",
    name: "ดร.ณัฐสิทธิ์  เจียรวัฒน์ชัย",
    role: "กรรมการสรรหาและกำหนด  ",
    image: "/images/board/User_shadow.png",
    category: "board",
  },
  {
    id: "m12",
    name: "พ.อ.กิตติเมธ เมืองอ่ำ",
    role: "กรรมการอิสระ",
    image: "/images/board/User_shadow.png",
    category: "board",
  },

  {
    id: "s01",
    name: "นายพงศธัช อัศวินวิจิตร",
    role: "กรรมการ และ กรรมการผู้จัดการ",
    image: "/images/subcommittee/User_shadow2.png",
    category: "executive",
  },
  {
    id: "e01",
    name: "นางวิไล วรรณมหินทร์",
    role: "ผู้จัดการทั่วไป สายงานบริหารและกำกับกิจการ ",
    image: "/images/subcommittee/User_shadow_f.png",
    category: "executive",
  },
];

export default function Page() {
  const [active, setActive] = useState<TabId>("board");

  const visibleMembers = useMemo(
    () => MEMBERS.filter((m) => m.category === active),
    [active]
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Hero />

      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pb-16">
        <div className="mt-2 sm:mt-6">
          <h2 className="sr-only">เปลี่ยนหมวด</h2>
          <nav
            aria-label="แถบหมวด"
            className="sticky top-0 z-30 -mx-3 px-3 sm:static sm:mx-0 sm:px-0 bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur border-b border-emerald-100">
            <div className="inline-flex min-w-full sm:min-w-0 items-center gap-1 sm:gap-2 whitespace-nowrap py-2">
              <div className="inline-flex rounded-xl bg-emerald-50 p-1 ring-1 ring-emerald-200 w-full max-w-full overflow-x-auto">
                {TABS.map((t) => {
                  const isActive = t.id === active;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActive(t.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        "px-3 py-2 text-sm rounded-lg transition flex-1 sm:flex-none",
                        isActive
                          ? "bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-300"
                          : "text-gray-600 hover:text-emerald-700",
                      ].join(" ")}>
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>

        <section className="mt-3 sm:mt-6 rounded-2xl border border-emerald-300/60 bg-white/70 p-2 sm:p-6">
          <ul
            role="list"
            aria-live="polite"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            {visibleMembers.map((m) => (
              <li
                key={m.id}
                className="group overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 transition hover:shadow-md">
                <div className="relative bg-white">
                  <div className="relative w-full pt-[125%] bg-white">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, (min-width:640px) 50vw, 50vw"
                        className="object-contain p-2 sm:p-4"
                        priority={false}
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center bg-gradient-to-b from-gray-50 to-gray-100">
                        <span className="text-xs text-gray-400">ไม่มีรูป</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-100/90 px-2 sm:px-3 py-2 text-center">
                  <p className="text-[12px] sm:text-sm font-medium leading-5 text-gray-900">
                    {m.name}
                  </p>
                  {m.role && (
                    <p className="mt-0.5 text-[10px] sm:text-xs text-gray-600">
                      {m.role}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative w-full">
      {/* พื้นหลังเต็มจอ */}
      <div className="relative w-full overflow-hidden">
        {/* สูงแบบ responsive: มือถือ/แท็บเล็ต/เดสก์ท็อป */}
        <div className="relative h-[36vh] sm:h-[44vh] lg:h-[56vh] xl:h-[62vh] 2xl:h-[640px]">
          <Image
            src={HERO_BG_URL}
            alt="background"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]" />
          <div className="absolute inset-0 flex items-center">
            {/* เนื้อหาอยู่ใน container ปกติ */}
            <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-emerald-700">
                {HERO_TITLE}
              </h1>
              <p className="mt-2 sm:mt-3 max-w-3xl text-[13px] sm:text-base leading-6 text-gray-700">
                {HERO_DESC}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
