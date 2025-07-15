"use client";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Aboutdata } from "@/app/api/data";

const Aboutus = () => {
  return (
    <section className=" bg-cover bg-center dark:bg-darkmode overflow-hidden">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) relative z-1 md:max-w-(--breakpoint-md)" style={{ maxWidth: "100%" }}>
        <div className="lg:p-12 px-2 bg-grey dark:bg-darkmode rounded-3xl position-relative mx-auto" style={{ maxWidth: "100%" }}>


          <h4 className="text-center text-4xl lg:text-65 font-bold pb-12">
            เกี่ยวกับเรา
          </h4>
          <div className="container fluid px-0">
            <div className=" hover:bg-darkmode bg-white rounded-3xl p-4 shadow-xl group mb-5 ">
              <div className="d-flex align-items-center gap-3">
                <Image
                  src="/images/team/TPP-1.jpg"
                  width={500}
                  height={500}
                  alt="team-member"
                  className="mb-0"
                  style={{ objectFit: "cover" }}
                />
                <div>
                  <h4 className="text-4xl font-semibold text-black group-hover:text-gray-500 mb-1">
                    บริษัท ไทยบรรจุภัณฑ์และการพิมพ์ จำกัด (มหาชน)
                  </h4>
                  <a className="text-lg font-normal text-black group-hover:text-white mb-1" style={{ display: 'block', maxWidth: 1245 }}>
                    ก่อตั้งขึ้นเมื่อปี 2526 เป็นผู้นำด้านการผลิตและออกแบบกล่องบรรจุภัณฑ์กระดาษลอนลูกฟูกและกล่องกระดาษแข็ง พร้อมงานพิมพ์ออฟเซ็ทคุณภาพสูง สำหรับลูกค้าในหลากหลายอุตสาหกรรม เช่น อาหาร เครื่องดื่ม อิเล็กทรอนิกส์ ยานยนต์ และยารักษาโรค บริษัทมีความมุ่งมั่นในการพัฒนาเทคโนโลยีการผลิตและนวัตกรรมด้านบรรจุภัณฑ์อย่างต่อเนื่อง ได้รับการรับรองมาตรฐานคุณภาพ ISO 9001:2015, ISO 14001:2015 และ GMP/HACCP
                    ตลอดจนให้บริการออกแบบผลิตภัณฑ์ตามความต้องการของลูกค้า โดยคำนึงถึงประสิทธิภาพและความปลอดภัย นอกจากนี้
                    ยังเน้นสร้างสรรค์บรรจุภัณฑ์ที่เป็นมิตรกับสิ่งแวดล้อม
                    เพื่อตอบสนองกระแสรักษ์โลกและสร้างความยั่งยืนให้กับองค์กรและสังคม<br />
              <Link
                href="#"
                className="flex items-center gap-2 text-[18px] font-semibold text-primary hover-underline d-inline-flex align-items-center mt-3"
              >
                อ่านต่อ
                <Icon icon="tabler:chevron-right" width="20" height="20" />
              </Link>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Aboutus;
