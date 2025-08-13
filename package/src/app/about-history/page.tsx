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
    year: "พ.ศ. 2566 – 2567",
    description: "ปรับปรุงโรงงาน TVOI และยกระดับประสิทธิภาพการผลิตตามกรอบ ESG",
  },
  {
    year: "พ.ศ. 2563",
    description:
      "ปรับปรุงระบบคลังเมล็ด ปรับหลังคาเพื่อลดฝุ่นละออง ไม่ก่อมลพิษ แก้ไขและเพิ่มระบบความปลอดภัย",
  },
  {
    year: "พ.ศ. 2561",
    description:
      "นับถอยหลังโครงการผลิตพืชหมุนเวียนและโครงการบำบัด Nano Neutralization",
  },
  {
    year: "พ.ศ. 2544",
    description: "ขยายกำลังการผลิต 3,500 ตันเมล็ดถั่วเหลือง/วัน",
  },
  {
    year: "พ.ศ. 2533",
    description:
      "ติดตั้งโรงกลั่นและบรรจุ โอเลอินปาล์มน้ำมันและเมล็ดถั่วเหลือง ขยายกำลังผลิตน้ำมันถั่วเหลือง 600 ตันเมล็ดถั่วเหลือง/วัน",
  },
  {
    year: "พ.ศ. 2510",
    description:
      "ก่อตั้งบริษัทน้ำมันพืช จำกัด และต่อมาเปลี่ยนชื่อเป็นบริษัท น้ำมันพืชไทย จำกัด (มหาชน)",
  },
];

const milestonesRight: Milestone[] = [
  {
    year: "พ.ศ. 2565",
    description:
      "ปรับปรุงระบบท่าเทียบเรือและโครงการเครนลำเลียง 4 คัน เพื่อลดเวลาขนถ่าย และรับเรือขนาด 30,000 ตันได้ตามมาตรฐาน",
  },
  {
    year: "พ.ศ. 2562",
    description:
      "เริ่มใช้งานระบบ ICE Condensing และ Expander เพื่อเพิ่มประสิทธิภาพพลังงาน และระบบก๊าซชีวภาพในโรงงาน",
  },
  {
    year: "พ.ศ. 2553",
    description: "ขยายกำลังการผลิต 6,000 ตันเมล็ดถั่วเหลือง/วัน",
  },
  {
    year: "พ.ศ. 2540",
    description: "ขยายกำลังการผลิต 1,500 ตันเมล็ดถั่วเหลือง/วัน",
  },
  {
    year: "พ.ศ. 2528",
    description:
      "จดทะเบียนเป็นบริษัทมหาชนจำกัด เข้าตลาดหลักทรัพย์ กำลังการผลิต 400 ตันเมล็ดถั่วเหลือง/วัน",
  },
];

// ===== Page =====
export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-800">
      <Hero />
      <Intro />
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
          src="/images/history/bg-history.jpg"
          alt="ประวัติองค์กร"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/60 to-white" />
      </div>

      {/* Secondary strip image */}
      <div className="relative h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px]">
        <Image
          src="/images/history/bg-story.jpg"
          alt="โรงงานและถังเก็บ"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/40 to-white" />
      </div>

      {/* Page title */}
      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <h1 className="inline-block rounded-2xl bg-white/80 px-5 py-3 text-lg font-semibold shadow-sm backdrop-blur">
          ประวัติองค์กร
        </h1>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="container mx-auto px-4 py-10 md:py-14">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3 leading-8">
          <p className="mb-4">
            บริษัท น้ำมันพืชไทย จำกัด (มหาชน) ก่อตั้งมากว่า 50 ปี
            ดำเนินธุรกิจผลิตและจำหน่ายน้ำมันพืช
            โดยมุ่งพัฒนาศักยภาพการผลิตอย่างต่อเนื่องและใส่ใจสิ่งแวดล้อมตามแนวทาง
            ESG
          </p>
          <p>
            ตลอดระยะเวลา
            บริษัทได้ขยายกำลังการผลิตและปรับปรุงโครงสร้างพื้นฐานเพื่อรองรับความต้องการของตลาด
            ควบคู่กับการยกระดับมาตรฐานความปลอดภัย อาชีวอนามัย
            และสิ่งแวดล้อมอย่างยั่งยืน
          </p>
        </div>
        <aside className="md:col-span-2 bg-green-50 border border-green-100 rounded-2xl p-5">
          <h3 className="text-green-700 font-bold mb-2">วิสัยทัศน์</h3>
          <p className="text-sm md:text-base">
            เป็นองค์กรชั้นนำด้านผลิตภัณฑ์น้ำมันพืชคุณภาพสูง
            ดำเนินธุรกิจอย่างรับผิดชอบต่อสังคมและสิ่งแวดล้อม
          </p>
        </aside>
      </div>
    </section>
  );
}

function TimelineSection({
  leftItems,
  rightItems,
}: {
  leftItems: Milestone[];
  rightItems: Milestone[];
}) {
  // make both sides equal height by interleaving empty slots on mobile automatically
  const maxItems = Math.max(leftItems.length, rightItems.length);

  return (
    <section className="relative bg-neutral-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-green-800 mb-10">
          พัฒนาการที่สำคัญ
        </h2>

        {/* timeline wrapper */}
        <div className="relative">
          {/* center line */}
          <div className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-green-300" />

          <ol className="space-y-6 md:space-y-10">
            {Array.from({ length: maxItems }).map((_, i) => (
              <li
                key={i}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-stretch">
                {/* Left column item */}
                <div className="md:pr-8 relative">
                  {leftItems[i] ? (
                    <TimelineCard {...leftItems[i]} align="left" />
                  ) : (
                    <span className="hidden md:block" />
                  )}
                  {/* connector dot (left side) */}
                  {leftItems[i] && (
                    <span
                      aria-hidden
                      className="hidden md:block absolute top-1/2 right-[-13px] -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-600 shadow"
                    />
                  )}
                </div>

                {/* Right column item */}
                <div className="md:pl-8 relative">
                  {rightItems[i] ? (
                    <TimelineCard {...rightItems[i]} align="right" />
                  ) : (
                    <span className="hidden md:block" />
                  )}
                  {/* connector dot (right side) */}
                  {rightItems[i] && (
                    <span
                      aria-hidden
                      className="hidden md:block absolute top-1/2 left-[-13px] -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-600 shadow"
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function TimelineCard({
  year,
  title,
  description,
  align,
}: Milestone & { align: "left" | "right" }) {
  return (
    <article
      className={`rounded-2xl bg-white border border-neutral-200 p-5 md:p-6 shadow-sm ${
        align === "left" ? "md:text-right" : ""
      }`}>
      <div className="text-xs font-semibold tracking-wider text-green-700">
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
