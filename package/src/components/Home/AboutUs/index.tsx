"use client";
import Link from "next/link";
import { Icon } from "@iconify/react";

const Aboutus = () => {
  return (
    <section className="about-bg-image relative bg-cover bg-center md:overflow-hidden dark:bg-neutral-900">
      <div className="absolute inset-0 md:hidden pointer-events-none bg-gradient-to-r from-white/70 to-white/0 dark:from-black/50 dark:to-transparent" />

      <div className="relative mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-w-0 grid-cols-12 items-center min-h-[60svh] py-12 sm:py-16 lg:py-20">
          <div className="col-span-12 md:col-span-7 lg:col-span-6 xl:col-span-5 min-w-0">
            <div className="w-full max-w-[clamp(300px,90vw,550px)]">
              <strong className="text-[clamp(1.125rem,4.6vw,1.75rem)] font-bold leading-tight text-neutral-900 dark:text-neutral-50 [text-wrap:balance]">
                <span>เกี่ยวกับ</span>&nbsp; ไทยบรรจุภัณฑ์และการพิมพ์
              </strong>

              {/* ⬇️ กันคำยาวดันล้น */}
              <p className="mt-4 text-[clamp(0.95rem,3.8vw,1rem)] leading-7 break-words  text-neutral-700 dark:text-neutral-300">
                <b className="text-red-700">
                  TPP หรือ บริษัท ไทยบรรจุภัณฑ์และการพิมพ์ จำกัด (มหาชน)
                </b>
                &nbsp; ผู้นำด้านการผลิตและออกแบบบรรจุภัณฑ์กระดาษลูกฟูก
                และกล่องกระดาษแข็ง พร้อมงานพิมพ์ออฟเซ็ทคุณภาพสูง
                ด้วยประสบการณ์ยาวนานกว่า 40 ปี
                เรามุ่งมั่นพัฒนานวัตกรรมบรรจุภัณฑ์และเทคโนโลยีการผลิตที่ทันสมัย
                เพื่อตอบโจทย์ลูกค้าในอุตสาหกรรมต่างๆ เช่น อาหาร, เครื่องดื่ม,
                และยานยนต์ โดยยึดมั่นในมาตรฐานสากล ISO 9001:2015 และ GMP/HACCP
                พร้อมทั้งให้ความสำคัญกับ บรรจุภัณฑ์ที่เป็นมิตรกับสิ่งแวดล้อม
                เพื่อการเติบโตอย่างยั่งยืน
              </p>

              <Link
                href="#"
                className="mt-4 inline-flex items-center gap-2 text-primary font-semibold hover:underline text-[clamp(0.95rem,3.4vw,1rem)]">
                อ่านต่อ{" "}
                <Icon icon="tabler:chevron-right" width={20} height={20} />
              </Link>
            </div>
          </div>

          {/* ช่องว่างขวา: แสดงเฉพาะ md+ */}
          <div className="hidden md:block md:col-span-5 lg:col-span-6 xl:col-span-7" />
        </div>
      </div>
    </section>
  );
};

export default Aboutus;

// <strong className="text-3xl font-bold mb-4 custom-Charcoal-gray">
//   <span className="custom-Charcoal-gray">เกี่ยวกับ</span>
//   &nbsp; ไทยบรรจุภัณฑ์และการพิมพ์
// </strong>;
