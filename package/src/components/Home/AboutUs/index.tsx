"use client";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Aboutdata } from "@/app/api/data";

const Aboutus = () => {
  return (
    <section className=" bg-cover bg-center dark:bg-darkmode overflow-hidden ">
          {/* <h4 className="text-center font-bold pb-4 underline decoration-red-500 decoration-8 " style={{ fontSize: "34px"}}>
            เกี่ยวกับเรา
          </h4> */}
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) relative z-1 md:max-w-(--breakpoint-md)" style={{ maxWidth: "100%" }}>
        <div className="lg:p-12 px-2 bg-grey dark:bg-darkmode rounded-none position-relative mx-auto about-bg-image" >


 
      <div className="container mx-auto max-w-6xl relative z-1">
        {/* เพิ่ม flex-row และแบ่ง 2 ฝั่ง */}
        <div className="flex flex-col md:flex-row">
          {/* ซ้าย: รูปถั่วเป็น bg */}
          <div className="md:w-1/2 w-full flex items-center justify-center p-8 bg-transparent">
            <div className="max-w-xl">
              <strong className="text-3xl font-bold mb-4 text-red-700">
                <span className="text-gray-500">เกี่ยวกับ</span>&nbsp;
                 ไทยบรรจุภัณฑ์และการพิมพ์
              </strong>
              <p className="mb-4 text-lg text-gray-800 dark:text-white">
                <b className="text-red-700">TPP หรือ บริษัท ไทยบรรจุภัณฑ์และการพิมพ์ จำกัด (มหาชน)</b>&nbsp;
                   ผู้นำด้านการผลิตและออกแบบ บรรจุภัณฑ์กระดาษลูกฟูก และ กล่องกระดาษแข็ง พร้อมงานพิมพ์ออฟเซ็ทคุณภาพสูง ด้วยประสบการณ์ยาวนานกว่า 40 ปี 
                   เรามุ่งมั่นพัฒนา นวัตกรรมบรรจุภัณฑ์ และเทคโนโลยีการผลิตที่ทันสมัย เพื่อตอบโจทย์ลูกค้าในอุตสาหกรรมต่างๆ เช่น อาหาร, เครื่องดื่ม, และยานยนต์ 
                   โดยยึดมั่นในมาตรฐานสากล ISO 9001:2015 และ GMP/HACCP พร้อมทั้งให้ความสำคัญกับ บรรจุภัณฑ์ที่เป็นมิตรกับสิ่งแวดล้อม เพื่อการเติบโตอย่างยั่งยืน
              </p>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-[18px] font-semibold text-primary hover:underline"
              >
                อ่านต่อ
                <Icon icon="tabler:chevron-right" width="20" height="20" />
              </Link>
            </div>
          </div>

          {/* ขวา: กล่องข้อความ */}
          <div
            className="md:w-1/2 w-full h-[280px] md:h-auto bg-center bg-cover"
            style={{
              // backgroundImage: "url('/soybean.jpg')", // เปลี่ยน path เป็นรูปของคุณ
              minHeight: "320px",
            }}
          ></div>
        </div>
        </div>

        </div>
      </div>
    </section>
  );
};

export default Aboutus;
