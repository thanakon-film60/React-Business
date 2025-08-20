// app/about/history/page.tsx
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ประวัติองค์กร | Your Company",
  description: "หน้าแสดงประวัติองค์กรและพัฒนาการที่สำคัญในรูปแบบไทม์ไลน์",
};

// ===== Types =====
type Milestone = {
  year: string; // พ.ศ.
  title?: string;
  description: string;
};

// ===== Data (ตัวอย่าง - ปรับแก้ได้ตามจริง) =====
const milestonesLeft: Milestone[] = [
  {
    year: "พ.ศ. 2561",
    description: "-เครื่องปะหน้าต่าง -เครื่องแกะกล่องกระดาษ",
  },
  {
    year: "พ.ศ. 2559",
    description: "-เครื่องพิมพ์ 8 สี -เครื่องปะอัตโนมัติ",
  },
  {
    year: "พ.ศ. 2555",
    description: "เครื่องทำลอนลูกฟูก ลอน B และ E",
  },
  {
    year: "พ.ศ. 2551",
    description: "เครื่องพิมพ์ 6 สี",
  },
  {
    year: "พ.ศ. 2537",
    description: "แปลสภาพเป็นบริษัทมหาชน",
  },
  {
    year: "พ.ศ. 2526",
    description: "ก่อตั้งบริษัทด้วยทุนจดทะเบียน 20 ล้านบาท",
  },
];

const milestonesRight: Milestone[] = [
  {
    year: "พ.ศ. 2562",
    description: "เครื่องปะอัตโนมัติ",
  },
  {
    year: "พ.ศ. 2560",
    description:
      "-เครื่องปะกึ่งอัตโนมัติ -เครื่องปะหน้าต่าง -เครื่องปั้มกล่อง -เครื่องตัดกล่องตัวอย่าง",
  },
  {
    year: "พ.ศ. 2556",
    description: "เครื่อง Computer to Plate (CTP)",
  },
  {
    year: "พ.ศ. 2554",
    description: "กรรมการผู้จัดการคนปัจจุบันเข้ารับตำแหน่ง",
  },
  {
    year: "พ.ศ. 2550",
    description: "เครื่องพิมพ์ 6 สี",
  },
  {
    year: "พ.ศ. 2533",
    description:
      "เข้าจดทะเบียนในตลาดหลักทรัพย์ โดยมีทุนที่ออกจำหน่ายและชำระเต็มจำนวน 375 ล้านบาท",
  },
];

const historyOverlayText = `บริษัท ไทยบรรจุภัณฑ์และการพิมพ์ จำกัด (มหาชน) ก่อตั้งขึ้นเมื่อวันที่ 9 พฤษภาคม พ.ศ. 2526 ด้วยทุนจดทะเบียนเริ่มต้น 20 ล้านบาท โดยผู้ถือหุ้นชาวไทยทั้งหมด เพื่อดำเนินธุรกิจด้านบรรจุภัณฑ์ที่มีบทบาทสำคัญต่อการส่งเสริมการขายสินค้า

เริ่มต้นการผลิตในปี พ.ศ. 2527 ที่กรุงเทพฯ ก่อนจะขยายกำลังการผลิตและย้ายฐานการผลิตมายังถนนกิ่งแก้ว อำเภอบางพลี จังหวัดสมุทรปราการ บนพื้นที่กว่า 31.5 ไร่ เพื่อรองรับความต้องการที่เพิ่มขึ้นอย่างต่อเนื่อง ต่อมาในปี พ.ศ. 2533 บริษัทได้รับอนุญาตเข้าจดทะเบียนในตลาดหลักทรัพย์แห่งประเทศไทย และแปรสภาพเป็นบริษัทมหาชนจำกัดเมื่อวันที่ 25 มีนาคม พ.ศ. 2537

ปัจจุบันบริษัทมีทุนจดทะเบียนชำระแล้ว 375 ล้านบาท มีกำลังการผลิตกว่า 11,000 ตันต่อปี และพนักงานกว่า 200 คน โดยมุ่งมั่นพัฒนาเครื่องจักรและเทคโนโลยีการผลิตที่ทันสมัย เพื่อสร้างบรรจุภัณฑ์คุณภาพสูง ตอบสนองความต้องการของตลาด และเพิ่มขีดความสามารถในการแข่งขันอย่างยั่งยืน`;

// ===== Page =====
export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-800">
      <Hero />
      <TimelineSection
        leftItems={milestonesLeft}
        rightItems={milestonesRight}
      />
    </main>
  );
}

// ===== Sections =====
function Hero() {
  return (
    <section className="relative w-full">
      {/* Top montage / hero */}
      <div className="relative h-[240px] sm:h-[320px] md:h-[420px] lg:h-[520px]">
        <Image
          src="/images/history/bg-history-1.png"
          alt="ประวัติองค์กร"
          fill
          priority
          className="object-cover"
        />
        {/* ไล่สีช่วยให้อ่านง่าย */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/60 to-white" />

        {/* === กล่องข้อความที่วางทับบนรูป === */}
        <div className="absolute inset-0 z-10 flex items-end md:items-center">
          {/* เพิ่ม flex + justify-end ที่แถวนี้ */}
          <div className="container mx-auto px-4 pb-6 md:pb-10 flex justify-start">
            <div className="max-w-4xl rounded-2xl bg-white/85 backdrop-blur shadow-lg border border-neutral-200 p-4 md:p-6">
              <h4 className="text-base md:text-2xl font-bold mb-2">
                ประวัติและความเป็นมา
              </h4>
              <p className="whitespace-pre-line text-sm md:text-base leading-7 text-neutral-800">
                {historyOverlayText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== แทนที่ทั้งฟังก์ชัน TimelineSection เดิมด้วยอันนี้ =====
function TimelineSection({
  leftItems,
  rightItems,
}: {
  leftItems: Milestone[];
  rightItems: Milestone[];
}) {
  // === เตรียมข้อมูลพื้นฐาน ===
  const parseYear = (s: string) => {
    const m = s.match(/\d{4}/);
    return m ? parseInt(m[0], 10) : 0; // พ.ศ.
  };
  type Side = "left" | "right";
  type SideEvent = Milestone & { side: Side };

  const toSide =
    (side: Side) =>
    (e: Milestone): SideEvent => ({ ...e, side });

  const all: SideEvent[] = [
    ...leftItems.map(toSide("left")),
    ...rightItems.map(toSide("right")),
  ];

  // เรียงปีจาก "น้อย -> มาก"
  const yearsAsc = Array.from(
    new Set(all.map((e) => parseYear(e.year)).filter(Boolean))
  ).sort((a, b) => a - b);

  // === พารามิเตอร์เว้นระยะ (เดสก์ท็อป) ===
  const PX_PER_YEAR = 10;
  const MIN_STEP = 40;
  const MAX_STEP = 96;
  const CARD_EST = 120;
  const EDGE_GAP = 96;
  const PAD_TOP = 24;
  const PAD_BOTTOM = 120;

  const yBaseByYear: Record<number, number> = {};
  let y = PAD_TOP;
  yearsAsc.forEach((yr, i) => {
    if (i === 0) {
      yBaseByYear[yr] = y;
      return;
    }
    const prev = yearsAsc[i - 1];
    const diff = yr - prev;
    const step = Math.min(
      MAX_STEP,
      Math.max(MIN_STEP, MIN_STEP + diff * PX_PER_YEAR)
    );
    y += step;
    yBaseByYear[yr] = y;
  });

  // จัดกลุ่มเหตุการณ์ตามปี
  const grouped: Record<number, SideEvent[]> = {};
  for (const ev of all) {
    const yr = parseYear(ev.year);
    if (!yr) continue;
    (grouped[yr] ||= []).push(ev);
  }

  // วางตำแหน่งจริง (เดสก์ท็อป)
  type Placement = {
    yr: number;
    left: SideEvent[];
    right: SideEvent[];
    leftTops: number[];
    rightTops: number[];
    dotTop: number;
  };

  const placements: Placement[] = [];
  let prevBottomLeft = -Infinity;
  let prevBottomRight = -Infinity;

  for (const yr of yearsAsc) {
    const base = yBaseByYear[yr];
    const items = grouped[yr] || [];
    const left = items.filter((i) => i.side === "left");
    const right = items.filter((i) => i.side === "right");

    // ฝั่งซ้าย
    const leftTops: number[] = [];
    left.forEach((_, idx) => {
      const start = base + idx * (CARD_EST + EDGE_GAP);
      const minCenter = prevBottomLeft + EDGE_GAP + CARD_EST / 2;
      const top = Math.max(start, minCenter);
      leftTops.push(top);
      prevBottomLeft = top + CARD_EST / 2;
    });

    // ฝั่งขวา
    const rightTops: number[] = [];
    right.forEach((_, idx) => {
      const start = base + idx * (CARD_EST + EDGE_GAP);
      const minCenter = prevBottomRight + EDGE_GAP + CARD_EST / 2;
      const top = Math.max(start, minCenter);
      rightTops.push(top);
      prevBottomRight = top + CARD_EST / 2;
    });

    // จุดปีบนเส้นกลาง
    const dotTop = Math.max(base, leftTops[0] ?? base, rightTops[0] ?? base);
    placements.push({ yr, left, right, leftTops, rightTops, dotTop });
  }

  const tallestBottom = Math.max(prevBottomLeft, prevBottomRight);
  const totalHeight = tallestBottom + PAD_BOTTOM;

  return (
    <section className="relative bg-neutral-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* หัวข้ออยู่ด้านบน (แก้คลาสด้านบนแล้ว) */}
        <h4 className="relative md:bottom-[90px] z-10 text-center text-2xl md:text-3xl font-bold text-green-800 mb-6 md:mb-0">
          พัฒนาการที่สำคัญ
        </h4>
        {/* ========== มือถือ: ไทม์ไลน์เส้นซ้าย + จุด + เส้นเชื่อม (เป๊ะกับเส้น) ========== */}
        <div className="md:hidden relative pl-8">
          {/* เส้นหลักทางซ้าย (กำหนดตำแหน่งเดียวกับจุด) */}
          <div
            className="absolute top-0 bottom-0 w-px bg-green-300"
            style={{ left: 18 }} /* px */
          />
          <ol className="space-y-6">
            {yearsAsc.flatMap((yr) =>
              (grouped[yr] || []).map((ev, idx) => (
                <li key={`${yr}-${idx}`} className="relative">
                  {/* จุดกลางเส้น (ศูนย์กลางตรงเส้นเป๊ะ) */}
                  <span
                    aria-hidden
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2
                           w-3 h-3 rounded-full bg-green-600 ring-4 ring-white shadow"
                    style={{ left: 18 }}
                  />
                  {/* เส้นเชื่อมเข้าการ์ด */}
                  <span
                    aria-hidden
                    className="absolute top-1/2 -translate-y-1/2 h-px bg-green-400"
                    style={{ left: 26, width: 24 }} /* 18 + 8, ยาว 24px */
                  />
                  <div className="pl-6">
                    <TimelineCard {...ev} align="left" />
                  </div>
                </li>
              ))
            )}
          </ol>
        </div>

        {/* ========== เดสก์ท็อป: เส้นกลาง + การ์ดสลับซ้าย/ขวา ========== */}
        <div
          className="relative hidden md:block mt-6 md:mt-8"
          style={{ height: totalHeight }}>
          {/* เส้นกลาง */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-1 bg-green-300" />

          {placements.map(
            ({ yr, left, right, leftTops, rightTops, dotTop }) => (
              <div key={yr}>
                {/* จุดใหญ่บนเส้นกลาง */}
                <span
                  aria-hidden
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-600 ring-4 ring-white shadow"
                  style={{ top: dotTop, width: 22, height: 22 }}
                />

                {/* การ์ดซ้าย */}
                {left.map((ev, i) => (
                  <div
                    key={`L${yr}-${i}`}
                    className="absolute right-[calc(50%+28px)] w-[44%] -translate-y-1/2"
                    style={{ top: leftTops[i] }}>
                    <div className="absolute right-[-28px] top-1/2 -translate-y-1/2 w-7 h-px bg-green-400" />
                    <TimelineCard {...ev} align="left" />
                  </div>
                ))}

                {/* การ์ดขวา */}
                {right.map((ev, i) => (
                  <div
                    key={`R${yr}-${i}`}
                    className="absolute left-[calc(50%+28px)] w-[44%] -translate-y-1/2"
                    style={{ top: rightTops[i] }}>
                    <div className="absolute left-[-28px] top-1/2 -translate-y-1/2 w-7 h-px bg-green-400" />
                    <TimelineCard {...ev} align="right" />
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

// ===== เพิ่มคอมโพเนนต์การ์ด (ของเดิมใช้ต่อได้ ไม่ต้องแก้) =====
function TimelineCard({
  year,
  title,
  description,
  align,
}: Milestone & { align: "left" | "right" }) {
  return (
    <article
      className={`rounded-2xl bg-white border border-neutral-200 p-5 md:p-6 shadow-sm min-h-[120px] ${
        align === "left" ? "md:text-right" : ""
      }`}>
      <div className="text-[24px] font-semibold tracking-wider text-green-700">
        {year}
      </div>
      {title && (
        <h3 className="mt-1 text-base md:text-lg font-bold">{title}</h3>
      )}
      <p className="mt-2 text-sm md:text-base leading-7 text-neutral-700">
        {description}
      </p>
    </article>
  );
}
