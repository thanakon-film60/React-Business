// src/app/about-philosophy.tsx
import Image from "next/image";
import QueryPart from "./_components/QueryClient";
import { Suspense } from "react";

export default function AboutPhilosophy() {
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
          <h2 className="font-bold text-2xl sm:text-3xl mb-3">วิสัยทัศน์</h2>
          <p className="mx-auto text-base sm:text-lg leading-relaxed break-words shadow-white-end ">
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
        {/* ทำให้ตัวหนังสืออ่านง่ายบนมือถือ */}
        <div className="absolute inset-0 -z-10 bg-white/75 md:bg-white/40 lg:bg-transparent" />

        <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-green-900">
            {/* วิสัยทัศน์ / พันธกิจ */}
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg sm:text-xl mb-1 text-green-700">
                  วิสัยทัศน์
                </h3>
                <p className="leading-relaxed break-words">
                  ก้าวสู่ธุรกิจอาหารและวัตถุดิบ...
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg sm:text-xl mb-1 text-green-700">
                  พันธกิจ
                </h3>
                <ul className="list-disc list-outside ml-5 space-y-1 leading-relaxed break-words">
                  <li>พัฒนาและสร้างสรรค์...</li>
                  <li>ปรับปรุงประสิทธิภาพการผลิต...</li>
                  <li>...</li>
                </ul>
              </div>
            </div>

            {/* ค่านิยมองค์กร */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg sm:text-xl mb-1 text-green-700">
                ค่านิยมขององค์กร
              </h3>
              <ul className="list-disc list-outside ml-5 space-y-1 leading-relaxed break-words">
                <li>
                  <b>T : Trust &amp; Teamwork</b> ...
                </li>
                <li>
                  <b>V : Value Creation</b> ...
                </li>
                <li>
                  <b>G : Cooperation &amp; Excellence</b> ...
                </li>
              </ul>
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
