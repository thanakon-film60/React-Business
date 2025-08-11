"use client";
import Link from "next/link";
import { Icon } from "@iconify/react";

const Aboutus = () => {
  return (
    <section className="about-bg-image relative overflow-hidden bg-cover bg-center dark:bg-neutral-900">
      {/* เฉพาะจอเล็ก: ไล่โทนบาง ๆ ให้ข้อความอ่านง่ายบนพื้นหลัง */}
      <div className="absolute inset-0 md:hidden pointer-events-none bg-gradient-to-r from-white/70 to-white/0 dark:from-black/50 dark:to-transparent" />

      <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* กำหนดพื้นที่ด้วยกริด: 12 คอลัมน์ */}
        <div className="grid grid-cols-12 items-center min-h-[60svh] py-12 sm:py-16 lg:py-20">
          {/* โซนข้อความ (ซ้าย) */}
          <div className="col-span-12 md:col-span-7 lg:col-span-6 xl:col-span-5">
            <div className="max-w-[72ch]">
              <strong className="text-3xl font-bold mb-4 custom-Charcoal-gray">
                <span className="custom-Charcoal-gray">เกี่ยวกับ</span>
                &nbsp; ไทยบรรจุภัณฑ์และการพิมพ์
              </strong>
              <p className="mt-4 text-base md:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
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
                className="mt-4 inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                อ่านต่อ{" "}
                <Icon icon="tabler:chevron-right" width={20} height={20} />
              </Link>
            </div>
          </div>

          {/* พื้นที่ว่าง (ขวา) เพื่อกันไม่ให้ข้อความล้นไปฝั่งภาพพื้นหลัง */}
          <div className="hidden md:block md:col-span-5 lg:col-span-6 xl:col-span-7" />
        </div>
      </div>
    </section>
  );
};

export default Aboutus;

// <div className="max-w-xl">
//   <strong className="text-3xl font-bold mb-4 custom-Charcoal-gray">
//     <span className="custom-Charcoal-gray">เกี่ยวกับ</span>
//     &nbsp; ไทยบรรจุภัณฑ์และการพิมพ์
//   </strong>
//   <p className="mb-4 text-lg custom-Ash-gray dark:text-white">
//     <b className="text-red-700">
//       TPP หรือ บริษัท ไทยบรรจุภัณฑ์และการพิมพ์ จำกัด (มหาชน)
//     </b>
//     &nbsp; ผู้นำด้านการผลิตและออกแบบ บรรจุภัณฑ์กระดาษลูกฟูก และ
//     กล่องกระดาษแข็ง พร้อมงานพิมพ์ออฟเซ็ทคุณภาพสูง
//     ด้วยประสบการณ์ยาวนานกว่า 40 ปี เรามุ่งมั่นพัฒนา
//     นวัตกรรมบรรจุภัณฑ์ และเทคโนโลยีการผลิตที่ทันสมัย
//     เพื่อตอบโจทย์ลูกค้าในอุตสาหกรรมต่างๆ เช่น อาหาร,
//     เครื่องดื่ม, และยานยนต์ โดยยึดมั่นในมาตรฐานสากล ISO
//     9001:2015 และ GMP/HACCP พร้อมทั้งให้ความสำคัญกับ
//     บรรจุภัณฑ์ที่เป็นมิตรกับสิ่งแวดล้อม
//     เพื่อการเติบโตอย่างยั่งยืน
//   </p>
//   <Link
//     href="#"
//     className="inline-flex items-center gap-2 text-[18px] font-semibold text-primary hover:underline">
//     อ่านต่อ
//     <Icon icon="tabler:chevron-right" width="20" height="20" />
//   </Link>
// </div>;
