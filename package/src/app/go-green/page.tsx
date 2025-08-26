// src/components/GoGreenSection.tsx
"use client";
import Image from "next/image";

type Feature = { icon: string; title: string; lines?: string[] };

export default function GoGreenSection({
  imageSrc = "/images/go-green/go_green_new_1.png",
  imageAlt = "Go Green",
  title = "Sustainability at TPP",
  subtitle = "ขับเคลื่อนสิ่งแวดล้อมและประสิทธิภาพพลังงาน",
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
  return (
    /**
     * FULL-BLEED + FLUSH-TOP
     * - กินเต็มหน้าจอจริง (หลุด container) ด้วย left-1/2 + -ml/-mr 50vw
     * - !py-0 !my-0 กำจัด padding/margin ที่ธีมอาจใส่ให้ section
     * - minHeight: เติมให้สูงอย่างน้อย = 100svh - ความสูงเฮดเดอร์ (เปลี่ยนตัวเลขได้)
     */
    <section
      className="
        relative left-1/2 -ml-[50vw] w-screen -mr-[50vw]
        isolate bg-neutral-100
        !py-0 !my-0
      "
      style={{
        // ถ้ามีเฮดเดอร์สูง ~120–128px ให้ลบออกเพื่อให้พอดีกับกรอบ
        minHeight: "calc(100svh - 128px)",
      }}>
      <div className="grid h-full grid-cols-2">
        {/* ซ้าย: รูปภาพเต็มครึ่งจอ */}
        <div className="relative h-full min-h-[560px] bg-[#D6001C]">
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

        {/* ขวา: หัวข้อ + การ์ดไอคอน */}
        <div className="relative h-full bg-neutral-200/70 p-8 md:p-12 xl:p-16">
          <div className="inline-block rounded-2xl bg-cyan-500 text-white px-8 py-6 shadow">
            <h2 className="text-2xl md:text-3xl xl:text-4xl font-extrabold leading-tight">
              {title}
            </h2>
            <p className="mt-2 text-base md:text-lg opacity-95">{subtitle}</p>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-6 md:p-7 text-center shadow ring-1 ring-black/5 hover:shadow-lg transition-shadow">
                <div className="relative mx-auto mb-4 h-16 w-16 md:h-20 md:w-20">
                  <Image
                    src={f.icon}
                    alt={f.title}
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>
                <div className="text-lg md:text-xl font-extrabold text-gray-800">
                  {f.title}
                </div>
                {f.lines?.map((t, idx) => (
                  <div
                    key={idx}
                    className="text-sm md:text-base leading-snug text-gray-600">
                    {t}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const SAMPLE_FEATURES: Feature[] = [
  {
    icon: "/images/go-green/icons/solar.png",
    title: "Solar Energy",
    lines: ["ประหยัดพลังงานได้", "517,800 kWh/ปี"],
  },
  {
    icon: "/images/go-green/icons/co2.png",
    title: "CO₂ Reduction",
    lines: ["ลดการปล่อยคาร์บอน", "≈ 320 ตัน/ปี"],
  },
  {
    icon: "/images/go-green/icons/water.png",
    title: "Water Saving",
    lines: ["ประหยัดน้ำในกระบวนการ", "ตามมาตรฐานโรงงานสีเขียว"],
  },
  {
    icon: "/images/go-green/icons/recycle.png",
    title: "Recycling",
    lines: ["วัสดุรีไซเคิล/หมุนเวียน", "เพิ่มสัดส่วนต่อเนื่อง"],
  },
  {
    icon: "/images/go-green/icons/energy.png",
    title: "Energy Efficiency",
    lines: ["ปรับปรุงประสิทธิภาพเครื่องจักร", "ตรวจวัดแบบเรียลไทม์"],
  },
  {
    icon: "/images/go-green/icons/tree.png",
    title: "Green Policy",
    lines: ["ปฏิบัติตามมาตรฐานสิ่งแวดล้อม", "ISO 14001 เป็นต้น"],
  },
];
