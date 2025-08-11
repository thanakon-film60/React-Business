// src/app/about-philosophy.tsx
import Image from "next/image";
import QueryPart from "./_components/QueryClient";
import { Suspense } from "react";

export default function AboutPhilosophy() {
  return (
    <>
      <div className="w-full">
        {/* ส่วนบน - รูปต้นไม้และเด็ก */}
        <div className="relative w-full h-[400px] md:h-[520px] lg:h-[600px]">
          <Image
            src="/images/aboutus/about-1.jpg" // เปลี่ยนชื่อไฟล์ตามของคุณ
            alt="Tree with kids"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-green-800">
            <h2 className="font-bold text-xl md:text-2xl mb-2">ปรัชญาองค์กร</h2>
            <p className="max-w-2xl text-base md:text-lg font-medium mx-auto drop-shadow-lg">
              มุ่งหวังจะพัฒนาอย่างต่อเนื่องด้านคุณภาพ...
            </p>
          </div>
        </div>

        {/* ส่วนล่าง - ข้อมูลและรูปโรงงาน เรือ รถบรรทุก ฯลฯ */}
        <div className="relative w-full h-[400px] md:h-[520px] lg:h-[600px]">
          <Image
            src="/images/aboutus/about-2.jpg" // เปลี่ยนชื่อไฟล์ตามของคุณ
            alt="Factory and Shipping"
            fill
            className="object-cover object-bottom opacity-70"
          />
          <div className="relative z-10 flex flex-col md:flex-row items-start max-w-6xl mx-auto py-16 gap-12 px-6 md:px-0">
            {/* ข้อมูล วิสัยทัศน์ พันธกิจ */}
            <div className="flex-1 space-y-6 text-green-900">
              <div>
                <h3 className="font-bold text-lg mb-1 text-green-700">
                  วิสัยทัศน์
                </h3>
                <p className="text-base">ก้าวสู่ธุรกิจอาหารและวัตถุดิบ...</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-green-700">
                  พันธกิจ
                </h3>
                <ul className="list-disc ml-6 text-base">
                  <li>พัฒนาและสร้างสรรค์...</li>
                  <li>ปรับปรุงประสิทธิภาพการผลิต...</li>
                  <li>...</li>
                </ul>
              </div>
            </div>
            {/* ค่านิยมองค์กร */}
            <div className="flex-1 space-y-6 text-green-900">
              <h3 className="font-bold text-lg mb-1 text-green-700">
                ค่านิยมขององค์กร
              </h3>
              <ul className="list-disc ml-6 text-base">
                <li>
                  <b>T : Trust & Teamwork</b> ...
                </li>
                <li>
                  <b>V : Value Creation</b> ...
                </li>
                <li>
                  <b>G : Cooperation & Excellence</b> ...
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={<div className="p-6">Loading…</div>}>
        <QueryPart />
      </Suspense>
    </>
  );
}
