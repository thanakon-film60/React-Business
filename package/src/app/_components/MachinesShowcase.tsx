"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import React from "react";

/**
 * MachinesShowcase (Tailwind-only version)
 * - แก้ปัญหาแสดงผลเป็นข้อความล้วน/สไตล์ไม่เข้า โดยเลิกใช้ styled-jsx
 * - ใช้ Tailwind + framer-motion ทั้งหมด
 * - วงล้อรูปภาพใช้ animate-[spin_42s_linear_infinite] และหยุดเมื่อ hover
 */

const LOGO_SRC = "/images/logo/logo.png"; // เปลี่ยนเป็นพาธโลโก้จริงในโปรเจ็กต์ // ⚠️ เปลี่ยนเป็นพาธโลโก้จริงในโปรเจ็กต์

const leftItems = [
  "Sample Box Cutting Machine",
  "Computer-to-Plate (CTP)",
  "5-Colors Printing Machine",
  "6-Colors Printing Machine",
  "8-Colors Printing Machine",
  "Corrugating Machine (B flute, E flute)",
  "Laminating Machine",
];

const rightItems = [
  "Die Cutting Machine",
  "Paper Stripping Machine",
  "Auto Gluing Machine",
  "Semi Auto Gluing Machine",
  "Hologram Sticker Machine",
  "Window Patching Machine",
  "Food Packaging Forming Machine",
];

const wheelPhotos: { src: string; alt: string }[] = [
  { src: "/images/factory/m1.jpg", alt: "Machine 1" },
  { src: "/images/factory/m2.jpg", alt: "Machine 2" },
  { src: "/images/factory/m3.jpg", alt: "Machine 3" },
  { src: "/images/factory/m4.jpg", alt: "Machine 4" },
  { src: "/images/factory/m5.jpg", alt: "Machine 5" },
  { src: "/images/factory/m6.jpg", alt: "Machine 6" },
  { src: "/images/factory/m7.jpg", alt: "Machine 7" },
  { src: "/images/factory/m8.jpg", alt: "Machine 8" },
];

const BRAND_RED = "#D6001C";
// รูป fallback กรณีโหลดไม่สำเร็จ (ป้องกันข้อความ alt โผล่)
const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23f1f5f9'/%3E%3Cstop offset='1' stop-color='%23e2e8f0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='10' height='10' fill='url(%23g)'/%3E%3C/svg%3E";

export default function MachinesShowcase() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  const listParent = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.12 },
    },
  } as const;
  const fromLeft = {
    hidden: { opacity: 0, x: -32 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 60 } },
  } as const;
  const fromRight = {
    hidden: { opacity: 0, x: 32 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 60 } },
  } as const;
  const popIn = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 70 },
    },
  } as const;

  return (
    <section
      className="relative overflow-hidden bg-neutral-50 py-12 md:py-16 lg:py-20"
      aria-label="Production machinery overview"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl"
          >
            ศักยภาพเครื่องจักรของเรา
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base"
          >
            ครบทุกกระบวนการ ตั้งแต่ก่อนพิมพ์ พิมพ์ ไปจนถึงหลังพิมพ์
            เพื่อคุณภาพและความรวดเร็วที่ไว้วางใจได้
          </motion.p>
        </div>

        {/* 3-column grid */}
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-10">
          {/* left list */}
          <motion.ul
            variants={listParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10%" }}
            className="order-2 space-y-3 md:order-1 md:justify-self-end md:max-w-[480px] w-full"
          >
            {leftItems.map((label) => (
              <motion.li key={label} variants={fromLeft}>
                <ArrowPill label={label} align="left" />
              </motion.li>
            ))}
          </motion.ul>

          {/* center wheel */}
          <motion.div
            variants={popIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="order-1 md:order-2 md:justify-self-center"
          >
            <PhotoWheel prefersReducedMotion={prefersReducedMotion} />
          </motion.div>

          {/* right list */}
          <motion.ul
            variants={listParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10%" }}
            className="order-3 space-y-3 md:justify-self-start md:max-w-[480px] w-full"
          >
            {rightItems.map((label) => (
              <motion.li key={label} variants={fromRight}>
                <ArrowPill label={label} align="right" />
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

function ArrowPill({
  label,
  align,
}: {
  label: string;
  align: "left" | "right";
}) {
  const isLeft = align === "left";
  return (
    <div className="group relative w-full">
      <div
        className={[
          "relative inline-flex w-full min-h-12 items-center rounded-full bg-white/85 px-4 py-3 shadow-sm backdrop-blur-md",
          "transition-all duration-200 hover:shadow-xl",
          isLeft ? "hover:translate-x-1" : "hover:-translate-x-1",
          // arrow head via ::after
          "after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:w-0 after:h-0 after:border-y-[16px] after:border-y-transparent",
          isLeft
            ? "after:-right-[18px] after:border-l-[18px] after:border-l-neutral-200 hover:after:border-l-[#D6001C]"
            : "after:-left-[18px] after:border-r-[18px] after:border-r-neutral-200 hover:after:border-r-[#D6001C]",
        ].join(" ")}
        style={{
          boxShadow: "0 1px 0 rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <span className="line-clamp-2 select-none text-[15px] font-medium tracking-tight text-neutral-800 md:text-base">
          {label}
        </span>
        <span
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(120deg, transparent 0%, rgba(214,0,28,0.06) 20%, rgba(214,0,28,0.12) 40%, transparent 60%)",
          }}
        />
      </div>
    </div>
  );
}

function PhotoWheel({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  const slots = [0, 1, 2, 3, 5, 6, 7, 8];
  const photos = wheelPhotos.length
    ? wheelPhotos
    : new Array(8).fill(null).map((_, i) => ({
        src: `/images/placeholder/${i + 1}.jpg`,
        alt: `placeholder ${i + 1}`,
      }));
  const spinClass = prefersReducedMotion
    ? ""
    : "animate-[spin_42s_linear_infinite] hover:[animation-play-state:paused]";

  return (
    <div className="relative mx-auto w-[clamp(260px,42vw,520px)] aspect-square overflow-hidden rounded-full bg-[radial-gradient(120px_circle_at_center,rgba(0,0,0,0)_0,rgba(0,0,0,0)_60px,rgba(0,0,0,0.06)_61px),linear-gradient(180deg,#f8fafc,#eef2f7)] shadow-[inset_0_12px_40px_rgba(0,0,0,0.10)]">
      <motion.div
        className={`absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1.5 p-1.5 ${spinClass}`}
      >
        {slots.map((slotIdx, i) => (
          <div key={slotIdx} className="relative overflow-hidden">
            <Image
              src={photos[i % photos.length].src}
              alt=""
              fill
              sizes="(max-width: 768px) 70vw, 35vw"
              priority={i < 2}
              className="object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
              }}
            />
          </div>
        ))}
      </motion.div>

      {/* center logo */}
      <div
        className="absolute left-1/2 top-1/2 grid h-[clamp(112px,18vw,180px)] w-[clamp(112px,18vw,180px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-[0_8px_22px_rgba(0,0,0,0.18),0_0_0_10px_rgba(255,255,255,0.75)] ring-4 ring-white"
        aria-label="Brand logo"
      >
        <Image
          src={LOGO_SRC}
          alt=""
          width={120}
          height={180}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    </div>
  );
}
