// src/components/GoGreenSection.tsx
"use client";
import Image from "next/image";
import React from "react";
import { motion, useReducedMotion, Variants, useInView } from "framer-motion";

// ===== Types =====
type Feature = { icon: string; title: string; lines?: string[] };

// ===== Animation helpers =====
function useAnims() {
  const prefersReduced = useReducedMotion();
  const dur = (d: number) => (prefersReduced ? 0 : d);

  const sectionFade: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: dur(0.7), ease: [0.22, 1, 0.36, 1] },
    },
  };

  const slideRight: Variants = {
    hidden: { opacity: 0, x: 28 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: dur(0.9), ease: [0.22, 1, 0.36, 1] },
    },
  };

  const imageZoomIn: Variants = {
    hidden: { opacity: 0, y: 16, scale: 1.03 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: dur(1.1), ease: [0.22, 1, 0.36, 1] },
    },
  };

  const gridStagger: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.16,
        delayChildren: prefersReduced ? 0 : 0.12,
      },
    },
  };

  const cardUp: Variants = {
    hidden: { opacity: 0, y: 26, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: dur(0.7), ease: [0.22, 1, 0.36, 1] },
    },
  };

  return {
    prefersReduced,
    sectionFade,
    slideRight,
    imageZoomIn,
    gridStagger,
    cardUp,
  };
}

// ===== Component =====
export default function GoGreenSection({
  imageSrc = "/images/go-green/go_green_home_page_3.png",
  imageAlt = "Go Green",
  title = "Sustainability at TPP",
  subtitle = `" ขับเคลื่อนการเติบโตอย่างยั่งยืน เพื่อธุรกิจ สังคม และโลกใบนี้ "`,
  features = SAMPLE_FEATURES,
  imageFit = "cover", // "cover" | "contain"
}: {
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  subtitle?: string;
  features?: Feature[];
  imageFit?: "cover" | "contain";
}) {
  const { sectionFade, slideRight, imageZoomIn, gridStagger, cardUp } =
    useAnims();

  // Replay animations whenever the section enters the viewport
  const sectionRef = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, {
    amount: 0.35,
    margin: "-10% 0px -10% 0px",
  });

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={sectionFade}
      aria-label="Go Green – sustainability overview"
      className="
        relative left-1/2 -ml-[50vw] w-screen -mr-[50vw]
        isolate bg-neutral-100 !py-0 !my-0
      "
      style={{ minHeight: "calc(100svh - 128px)" }}
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-2">
        {/* Left: full-bleed image */}
        <motion.div
          variants={imageZoomIn}
          className="relative h-full min-h-[560px] overflow-hidden will-change-transform"
        >
          <div className="absolute inset-0">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              className={
                imageFit === "contain"
                  ? "object-contain object-center"
                  : "object-cover object-center"
              }
            />
          </div>
          {/* soft gradient to enhance readability on mobile when stacked */}
          <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        </motion.div>

        {/* Right: heading + feature cards */}
        <motion.div
          variants={slideRight}
          className="relative flex h-full flex-col bg-neutral-200/70 p-8 md:p-12 xl:p-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.12,
            }}
            className="inline-block text-white text-center p-0 shadow-none ring-0"
          >
            <h4
              className="fs-42 font-extrabold leading-tight text-black text-center"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.25)" }}
            >
              {subtitle}
            </h4>
            <p className="mt-2 text-base md:text-lg/relaxed opacity-95"></p>
          </motion.div>

          <motion.div
            variants={gridStagger}
            className="mt-8 md:mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f, i) => (
              <motion.article
                key={`${f.title}-${i}`}
                variants={cardUp}
                whileHover={{ y: -4, scale: 1.02 }}
                whileFocus={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                tabIndex={0}
                role="group"
                aria-label={f.title}
                className="rounded-2xl bg-white p-6 md:p-7 text-center shadow ring-1 ring-black/5 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
              >
                <div className="relative mx-auto mb-4 h-16 w-16 md:h-20 md:w-20 will-change-transform">
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={f.icon}
                      alt={f.title}
                      fill
                      sizes="80px"
                      className="object-contain"
                    />
                  </motion.div>
                </div>
                <div className="text-lg md:text-xl font-extrabold text-gray-800 group-focus:text-cyan-700">
                  {f.title}
                </div>
                {f.lines?.map((t, idx) => (
                  <div
                    key={idx}
                    className="text-sm md:text-base leading-snug text-gray-600"
                  >
                    {t}
                  </div>
                ))}
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ===== Sample data (unchanged) =====
export const SAMPLE_FEATURES: Feature[] = [
  {
    icon: "/images/go-green/icons/solar.png",
    title: "Solar Energy",
    lines: ["ประหยัดพลังงานได้", "xxx,xxx kWh/ปี"],
  },
  {
    icon: "/images/go-green/icons/energy.png",
    title: "Energy Saving",
    lines: ["ประหยัดค่าไฟฟ้า ", "x.x ลบ. ต่อปี"],
  },
  {
    icon: "/images/go-green/icons/co2.png",
    title: "GHG Emissions Reduction",
    lines: ["ลดการปล่อยคาร์บอน", "≈ xxxx ตัน/ปี"],
  },
  {
    icon: "/images/go-green/icons/tree.png",
    title: "Tree-Planting Equivalent",
    lines: ["เก่ากับการปลูกต้นไม้", "XX,XXX,XXX ต้น"],
  },
  {
    icon: "/images/go-green/icons/truck_1.png",
    title: "Green Transport",
    lines: ["ลดการปล่อย", "ก๊าซคาร์บอนไดออกไซด์และมลภาวะสู่สิ่งแวดล้อม"],
  },
  {
    icon: "/images/go-green/icons/property-document_14001_1.png",
    title: "Green standard",
    lines: ["ปฏิบัติตามมาตรฐานสิ่งแวดล้อม", "ISO 14001 เป็นต้น"],
  },
];
