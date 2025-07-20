import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

const Footer = () => {
  return (
    <footer className="bg-[#D6001C] py-10 relative">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: Logo & Call Center */}
        <div className="flex flex-col items-start">
          <Image src="/images/logo/logo.png" alt="Micro Leasing Logo" width={120} height={120} />
          <div className="mt-4">
            <h3 className="text-micro-blue-200 text-xl md:text-2xl font-bold mb-2">ติดต่อสอบถาม</h3>
            <p className="text-white">02-175-2201-8<br />Contact@microleasingplc.com</p>
          </div>
          <div className="mt-6">
            <h4 className="text-micro-blue-200 text-lg md:text-xl font-bold mb-3">ติดตามเรา</h4>
            <div className="flex gap-4">
              <Link href="#"><Icon icon="ic:baseline-facebook" className="text-3xl text-white hover:text-yellow-400" /></Link>
              <Link href="#"><Icon icon="simple-icons:line" className="text-3xl text-white hover:text-yellow-400" /></Link>
              <Link href="#"><Icon icon="ri:tiktok-fill" className="text-3xl text-white hover:text-yellow-400" /></Link>
              <Link href="#"><Icon icon="mdi:youtube" className="text-3xl text-white hover:text-yellow-400" /></Link>
            </div>
          </div>
        </div>

        {/* Column 2: ที่อยู่ */}
        <div>
          <h4 className="text-micro-blue-200 text-xl md:text-2xl font-bold mb-2">บริษัท ไทยบรรจุภัณฑ์และการพิมพ์ จำกัด (มหาชน)</h4>
          <p className="text-white">
            9/9 หมู่ 6 ถนนกิ่งแก้ว<br />
            ตำบลราชาเทวะ<br />
            อำเภอบางพลี<br />
            จังหวัดสมุทรปราการ 10540.<br />
          </p>
          <h4 className="text-micro-blue-200 text-lg md:text-xl font-bold mt-6 mb-1">เวลาทำการ</h4>
          <p className="text-white">
            จันทร์ - เสาร์ 8.30 - 17.30 น.<br />
            วันหยุด วันอาทิตย์
          </p>
        </div>

        {/* Column 3: เกี่ยวกับเรา */}
        <div>
          <h4 className="text-micro-blue-200 text-xl md:text-2xl font-bold mb-4">เกี่ยวกับเรา</h4>
          <ul className="text-white space-y-3">
            {['เกี่ยวกับเรา', 'ติดต่อเรา', 'ร่วมงานกับเรา', 'นักลงทุนสัมพันธ์'].map((text, idx) => (
              <li key={idx}><Link href="#" className="hover:underline text-micro-white">{text}</Link></li>
            ))}
          </ul>
        </div>

        {/* Column 4: สินค้าและบริการ */}
        <div>
          <h4 className="text-micro-blue-200 text-xl md:text-2xl font-bold mb-4">สินค้าและบริการ</h4>
          <ul className="space-y-3">
            {["Pakku Packaging - Food Packaging","บริการของเรา"].map((text, idx) => (
              <li key={idx}><Link href="#" className="hover:underline text-micro-white">{text}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#f6f6f7] py-4 mt-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center text-micro-blue text-center text-sm gap-x-2 gap-y-2">
          <p className="whitespace-nowrap mb-0">
            © สงวนลิขสิทธิ์ พ.ศ. 2568 บริษัท ไมโครลิสซิ่ง จำกัด (มหาชน)
          </p>
          <ul className="flex flex-wrap items-center justify-center pl-0 mb-0 list-none">
            {[
              'ข้อกำหนดและเงื่อนไข',
              'การคุ้มครองข้อมูลส่วนบุคคล',
              'นโยบายการใช้คุกกี้',
              'แผนผังเว็บไซต์',
            ].map((text, idx, arr) => (
              <li key={idx} className="flex items-center">
                <Link href="#" className="text-blue-600 hover:underline whitespace-nowrap">
                  {text}
                </Link>
                {idx < arr.length - 1 && (
                  <span className="mx-2 text-blue-600">|</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
