"use client";

import Image from "next/image";
import React from "react";
import "animate.css"; // แนะนำให้นำไป import รวมที่ layout.tsx ได้เช่นกัน

// ===============
// AnimateOnView: เพิ่มคลาส animate.css เมื่อเข้าหน้าจอ
// ===============
function AnimateOnView({
  children,
  effect = "animate__fadeInUp",
  delay = 0,
  once = true,
  className = "",
}: {
  children: React.ReactNode;
  effect?: string;
  delay?: number;
  once?: boolean;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) obs.unobserve(el);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  const style: React.CSSProperties = delay
    ? { animationDelay: `${delay}ms` }
    : {};

  return (
    <div
      ref={ref}
      style={style}
      className={[
        className,
        visible ? `animate__animated ${effect}` : "opacity-0 translate-y-3",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// ===============
// Data
// ===============
type CertItem = {
  title: string;
  body: string;
  badges?: { src: string; alt: string }[];
};

const leftColumn: CertItem[] = [
  {
    title: "GHPs & HACCP",
    body: "แนวปฏิบัติด้านสุขลักษณะที่ดีและระบบวิเคราะห์อันตรายและจุดควบคุมวิกฤต เพื่อความปลอดภัยของอาหารในทุกขั้นตอน",
    badges: [
      { src: "/images/cert/ghp.png", alt: "GHPs" },
      { src: "/images/cert/haccp.png", alt: "HACCP" },
      { src: "/images/cert/gmp.png", alt: "GMP" },
    ],
  },
  {
    title: "ISO/TS 22002-1 (PAS 220)",
    body: "มาตรฐานโปรแกรมพื้นฐานก่อนการผลิตสำหรับอุตสาหกรรมอาหาร เพื่อสนับสนุนระบบความปลอดภัยของอาหาร ISO 22000.",
    badges: [{ src: "/images/cert/iso22002.png", alt: "ISO/TS 22002-1" }],
  },
  {
    title: "ISO 9001",
    body: "ระบบบริหารคุณภาพที่มุ่งเน้นลูกค้าและการปรับปรุงอย่างต่อเนื่อง ครอบคลุมกระบวนการหลักทั้งหมดขององค์กร.",
    badges: [{ src: "/images/cert/iso9001.png", alt: "ISO 9001" }],
  },
  {
    title: "ISO 14001",
    body: "ระบบการจัดการสิ่งแวดล้อมเพื่อลดผลกระทบต่อสิ่งแวดล้อมอย่างเป็นระบบและยั่งยืน.",
    badges: [{ src: "/images/cert/iso14001.png", alt: "ISO 14001" }],
  },
  {
    title: "Carbon Footprint Reduction",
    body: "โครงการลดการปล่อยก๊าซเรือนกระจกขององค์กรและผลิตภัณฑ์ พร้อมแนวทางติดตามและเปิดเผยข้อมูลอย่างโปร่งใส.",
    badges: [{ src: "/images/cert/tgo.png", alt: "TGO" }],
  },
  {
    title: "ISO 50001",
    body: "ระบบการจัดการพลังงานเพื่อเพิ่มประสิทธิภาพการใช้พลังงาน ลดต้นทุน และลดการปล่อยก๊าซเรือนกระจก.",
    badges: [{ src: "/images/cert/iso50001.png", alt: "ISO 50001" }],
  },
  {
    title: "Halal",
    body: "ได้รับการรับรองฮาลาล เหมาะสมต่อผู้บริโภคมุสลิม ครอบคลุมทุกขั้นตอนการผลิตอย่างเคร่งครัด.",
    badges: [{ src: "/images/cert/halal.png", alt: "Halal" }],
  },
  {
    title: "SEDEX / SMETA & ARAVO (URSA)",
    body: "มาตรฐานด้านจริยธรรม แรงงาน และความยั่งยืนในห่วงโซ่อุปทาน ผ่านการประเมินและแพลตฟอร์มจัดการซัพพลายเออร์.",
    badges: [{ src: "/images/cert/sedex.png", alt: "Sedex" }],
  },
  {
    title: "GMP Plus",
    body: "แนวทางการผลิตที่ดีสำหรับอาหารสัตว์เพื่อความปลอดภัยตลอดห่วงโซ่อุปทาน.",
    badges: [{ src: "/images/cert/gmpplus.png", alt: "GMP+" }],
  },
  {
    title: "RTRS",
    body: "มาตรฐาน Round Table on Responsible Soy: ถั่วเหลืองอย่างรับผิดชอบ ครอบคลุมสิ่งแวดล้อม สังคม และเศรษฐกิจ.",
    badges: [{ src: "/images/cert/rtrs.png", alt: "RTRS" }],
  },
];

const rightColumn: CertItem[] = [
  {
    title: "ISO 22000",
    body: "ระบบบริหารความปลอดภัยของอาหาร ครอบคลุมการควบคุมความเสี่ยงในทุกขั้นตอนของกระบวนการผลิต.",
    badges: [{ src: "/images/cert/iso22000.png", alt: "ISO 22000" }],
  },
  {
    title: "FSSC 22000",
    body: "Food Safety System Certification มาตรฐานความปลอดภัยอาหารระดับสากลที่อ้างอิง ISO 22000 และ ISO/TS 22002-1.",
    badges: [{ src: "/images/cert/fssc22000.png", alt: "FSSC 22000" }],
  },
  {
    title: "ISO 45001",
    body: "มาตรฐานอาชีวอนามัยและความปลอดภัยในการทำงาน เพื่อสภาพแวดล้อมการทำงานที่ปลอดภัยและยั่งยืน.",
    badges: [{ src: "/images/cert/iso45001.png", alt: "ISO 45001" }],
  },
  {
    title: "Carbon Footprint of Products",
    body: "แสดงปริมาณก๊าซเรือนกระจกต่อหนึ่งหน่วยผลิตภัณฑ์ เพื่อความโปร่งใสและทางเลือกที่ยั่งยืนให้ผู้บริโภค.",
    badges: [{ src: "/images/cert/cfp.png", alt: "CFP" }],
  },
  {
    title: "Green Industry",
    body: "โรงงานอุตสาหกรรมเชิงนิเวศ พัฒนาอย่างต่อเนื่องสู่ความยั่งยืน ลดผลกระทบต่อสิ่งแวดล้อม และเติบโตไปพร้อมชุมชน.",
    badges: [{ src: "/images/cert/greenindustry.png", alt: "Green Industry" }],
  },
  {
    title: "ISO/IEC 17025",
    body: "ความสามารถห้องปฏิบัติการทดสอบและสอบเทียบ ครอบคลุมความถูกต้องและความน่าเชื่อถือของผลทดสอบ.",
    badges: [{ src: "/images/cert/iso17025.png", alt: "ISO/IEC 17025" }],
  },
  {
    title: "Kosher",
    body: "การรับรองโคเชอร์สำหรับผู้บริโภคชาวยิว ดูแลการคัดเลือกวัตถุดิบและกระบวนการผลิตตามหลักศาสนา.",
    badges: [{ src: "/images/cert/kosher.png", alt: "Kosher" }],
  },
  {
    title: "อย. Quality Award 2017–2025",
    body: "รางวัลคุณภาพจากสำนักงานคณะกรรมการอาหารและยา สะท้อนมาตรฐานความปลอดภัยและคุณภาพต่อเนื่องหลายปี.",
    badges: [{ src: "/images/cert/fda-th.png", alt: "Thai FDA" }],
  },
  {
    title: "AOCS APPROVED CHEMIST",
    body: "นักเคมีที่ได้รับอนุมัติจาก American Oil Chemists' Society ชี้วัดความเชี่ยวชาญในการทดสอบน้ำมันและไขมัน.",
    badges: [{ src: "/images/cert/aocs.png", alt: "AOCS" }],
  },
  {
    title: "มาตรฐานแรงงานไทย มรท.8001-2563",
    body: "ยกระดับคุณภาพชีวิตแรงงาน ดูแลสิทธิมนุษยชน ความปลอดภัย และความเป็นธรรมในสถานประกอบการ.",
    badges: [{ src: "/images/cert/tsl.png", alt: "Thai Labor Standard" }],
  },
];

// ใช้คอนเทนเนอร์ที่ปรับ padding ได้
function SectionContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
// ===============
// Hero (เวอร์ชันเดียวพอ)
// ===============
function Hero() {
  return (
    <section className="relative -mt-px overflow-hidden rounded-b-2xl sm:rounded-b-3xl certification-bg-image">
      {/* ห้ามใส่ overlay ซ้ำใน JSX อีกแล้ว */}
      <SectionContainer className="min-h-[clamp(420px,36vw,700px)] px-2 md:px-3 lg:px-4">
        <div className="grid grid-cols-12 h-full">
          <div className="col-span-12 md:col-start-9 md:col-span-4 flex items-center justify-end text-right">
            <AnimateOnView
              effect="animate__fadeInDown"
              className="w-full max-w-[720px]"
            >
              {/* <p className="text-sm font-medium tracking-wide text-emerald-800/80">
        
              </p> */}
              <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-emerald-900">
                การรับรองคุณภาพ
              </h1>
              <p className="mt-3 text-emerald-900/80 text-sm sm:text-base">
                มุ่งมั่นพัฒนามาตรฐานการผลิต ควบคุมคุณภาพและความปลอดภัย
                ตามข้อกำหนดสากล เพื่อความเชื่อมั่นของลูกค้าและผู้บริโภค
              </p>
            </AnimateOnView>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

// ===============
// Card
// ===============
function CertCard({ item, index }: { item: CertItem; index: number }) {
  return (
    <AnimateOnView delay={Math.min(index * 60, 360)} effect="animate__fadeInUp">
      <article className="rounded-2xl border border-emerald-100 bg-white shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-emerald-900">
          {item.title}
        </h3>
        <p className="mt-2 text-[13px] sm:text-sm leading-relaxed text-emerald-900/80">
          {item.body}
        </p>

        {item.badges?.length ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {item.badges.map((b, i) => (
              <div
                key={i}
                className="relative h-6 w-14 grayscale contrast-125 opacity-90"
                title={b.alt}
              >
                <Image
                  src={b.src}
                  alt={b.alt}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        ) : null}
      </article>
    </AnimateOnView>
  );
}

// ===============
// Page
// ===============
export default function QualityCertificationsPage() {
  return (
    <main className="bg-white pt-0 mt-0">
      <Hero />

      {/* CONTENT GRID */}
      <SectionContainer>
        <div className="py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5 sm:gap-6 md:gap-8">
            {/* Left column */}
            <div className="space-y-4 sm:space-y-6">
              {leftColumn.map((it, i) => (
                <CertCard key={it.title} item={it} index={i} />
              ))}
            </div>

            {/* Right column */}
            <div className="space-y-4 sm:space-y-6">
              {rightColumn.map((it, i) => (
                <CertCard key={it.title} item={it} index={i} />
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </main>
  );
}
