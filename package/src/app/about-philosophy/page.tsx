// src/app/about-philosophy.tsx
import Image from "next/image";
import QueryPart from "./_components/QueryClient";
import { Suspense } from "react";

export default function AboutPhilosophy() {
  // === กลุ่ม “พันธกิจ” 4 หัวข้อ ===
  const missions: string[] = [
    "ดำเนินธุรกิจให้เติบโตอย่างยั่งยืน สร้างผลกำไรและผลตอบแทนที่ดี ด้วยหลักธรรมาภิบาล",
    "ผลิตสินค้าให้มีคุณภาพได้มาตรฐาน ส่งมอบสินค้าถูกต้องตรงเวลา พัฒนาระบบบริหารคุณภาพและบริการอย่างต่อเนื่อง เพื่อความพึงพอใจและไว้วางใจของลูกค้า",
    "เพิ่มประสิทธิภาพในการผลิตและการดำเนินงานลดความสูญเสียและความซ้ำซ้อน ปรับปรุงพัฒนาให้มีความรวดเร็วและมีคุณภาพที่ดีขึ้นอย่างต่อเนื่อง",
    "บริหารจัดการวัตถุดิบเลือกใช้วัตถุดิบที่มีคุณภาพ ปลอดภัยเพื่อเพิ่มประสิทธิภาพในการผลิตและการแข่งขันทั้งในด้านราคาและคุณภาพ",
    "สร้างสรรค์นวัตกรรม ความแตกต่างของผลิตภัณฑ์โดยนำเสนอ ให้คำแนะนำและแก้ไขปัญหาให้แก่ลูกค้า",
    "ส่งเสริมและพัฒนาบุคลากรให้มีศักยภาพ มีความคิดสร้างสรรค์มีทักษะที่ดีขึ้นอย่างต่อเนื่อง สร้างจิตสำนึก ความมีระเบียบวินัยทัศนคติที่ดี พร้อมให้คุณภาพชีวิตของพนักงานดีขึ้น",
    "ส่งเสริมและดำเนินการให้องค์กรเป็นสถานที่ทำงานที่มีความสุขความปลอดภัย และมีการสื่อสารและการทำงานร่วมกันเป็นทีมอย่างมีประสิทธิภาพ",
    "สร้างพันธมิตรคู่ค้าทางธุรกิจบนพื้นฐาน ความร่วมมือที่ดีเติบโตร่วมกันอย่างยั่งยืน พร้อมมีส่วนร่วมในการสนับสนุนดูแลสังคม และสิ่งแวดล้อม",
  ];

  // === “ค่านิยมขององค์กร” 4 หัวข้อ ===
  const values = [
    {
      k: "T : Trust & Teamwork",
      v: "ร่วมมือ เคารพ และไว้วางใจกัน ทำงานแบบทีม โปร่งใส ช่วยเหลือกันเพื่อเป้าหมายเดียวกัน",
    },
    {
      k: "V : Value Creation",
      v: "มุ่งสร้างคุณค่าให้ลูกค้าและผู้มีส่วนได้ส่วนเสีย ผ่านคุณภาพ นวัตกรรม และการปรับปรุงอย่างต่อเนื่อง",
    },
    {
      k: "G : Cooperation & Excellence",
      v: "ทำงานร่วมกันอย่างมืออาชีพ มุ่งมั่นสู่ความเป็นเลิศทั้งกระบวนการและผลลัพธ์",
    },
    {
      k: "E : Ethics & Responsibility",
      v: "ยึดมั่นจริยธรรม ธรรมาภิบาล รับผิดชอบต่อสังคมและสิ่งแวดล้อม",
    },
  ];

  return (
    <>
      {/* ส่วนบน */}
      <section className="relative w-full overflow-hidden min-h-[55svh] md:min-h-[60svh] lg:min-h-[70svh]">
        <Image
          src="/images/aboutus/vision_tpp.png"
          alt="Tree with kids"
          fill
          className="absolute inset-0 -z-10 object-cover object-center"
          priority
        />
        <div className="relative mx-auto max-w-screen-md px-4 sm:px-6 py-10 text-center text-green-800">
          <h2 className="font-bold text-2xl sm:text-3xl mb-3 fs-3 text-end text-black">
            วิสัยทัศน์
          </h2>
          <p className="mx-auto text-base sm:text-lg leading-relaxed break-words shadow-white-end custom-Charcoal-gray">
            เป็นผู้นำด้านธุรกิจการพิมพ์และบรรจุภัณฑ์กระดาษ
            มุ่งมั่นสร้างสรรค์นวัตกรรม
            พร้อมส่งมอบผลิตภัณฑ์และบริการที่มีคุณภาพให้กับลูกค้า
            เพื่อการเติบโตอย่างยั่งยืนของธุรกิจ
          </p>
        </div>
      </section>

      {/* ส่วนล่าง */}
      <section className="relative isolate w-full overflow-hidden">
        <Image
          src="/images/aboutus/about-2.jpg"
          alt="Factory and Shipping"
          fill
          className="absolute inset-0 -z-10 object-cover object-bottom"
        />
        {/* ช่วยให้อ่านง่ายบนมือถือ */}
        <div className="absolute inset-0 -z-10 bg-white/75 md:bg-white/40 lg:bg-transparent" />

        <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-10 xl:px-14 py-10 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-green-900">
            {/* พันธกิจ (8 กล่อง ไม่มีหัวข้อย่อย) */}
            <div className="space-y-6 md:col-span-2">
              <h3 className="font-bold text-lg sm:text-xl mb-1 text-black">
                พันธกิจ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 custom-Charcoal-gray">
                {missions.map((text, i) => (
                  <div
                    key={i}
                    className="h-full rounded-2xl bg-white/70 md:bg-white/40 lg:bg-white/20 backdrop-blur-sm p-5 shadow-sm">
                    <p className="leading-relaxed break-words">
                      <span className="mr-2 custom-Charcoal-gray" aria-hidden>
                        ●
                      </span>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ค่านิยมขององค์กร (4 หัวข้อ) */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg sm:text-xl mb-1 text-black">
                ค่านิยมขององค์กร
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 custom-Charcoal-gray">
                {values.map((val, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-white/70 md:bg-white/40 lg:bg-white/20 backdrop-blur-sm p-4 shadow-sm">
                    <div className="font-bold">{val.k}</div>
                    <p className="mt-1 leading-relaxed break-words">{val.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="p-6">Loading…</div>}>
        <QueryPart />
      </Suspense>
    </>
  );
}
