import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

const Footer = () => {
  return (
    <footer className="bg-[#D6001C] pt-14 pb-0 relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
        {/* Column 1: Logo & Call Center */}
        <div className="flex flex-col items-start">
          <Image src="/images/logo/logo.png" alt="Micro Leasing Logo" width={120} height={120} />
          <div className="mt-3">
            <h3 className="text-micro-yellow text-2xl font-bold mb-2">Call Center</h3>
            <p className="text-white">02-105-5599<br/>Contact@microleasingplc.com</p>
          </div>
          <div className="mt-7">
            <h4 className="text-micro-yellow text-xl font-bold mb-3">ติดตามเรา</h4>
            <div className="flex gap-5">
              <Link href="#"><Icon icon="ic:baseline-facebook" className="text-3xl text-white hover:text-yellow-400" /></Link>
              <Link href="#"><Icon icon="simple-icons:line" className="text-3xl text-white hover:text-yellow-400" /></Link>
              <Link href="#"><Icon icon="ri:tiktok-fill" className="text-3xl text-white hover:text-yellow-400" /></Link>
              <Link href="#"><Icon icon="mdi:youtube" className="text-3xl text-white hover:text-yellow-400" /></Link>
            </div>
          </div>
        </div>
        {/* Column 2: ที่อยู่ */}
        <div>
          <h4 className="text-micro-yellow text-2xl font-bold mb-2">สำนักงานใหญ่ จ.สมุทรปราการ</h4>
          <p className="text-white">
            9/9 หมู่ 6 ถนนกิ่งแก้ว<br />
            ตำบลราชาเทวะ<br />
            อำเภอเมืองสมุทรปราการ<br />
            จังหวัดสมุทรปราการ 10540<br />
            (ที่ตั้งบริษัทอยู่ติด ซอยกิ่งแก้ว 48)
          </p>
          <h4 className="text-micro-yellow text-xl font-bold mt-7 mb-1">เวลาทำการ</h4>
          <p className="text-white">
            จันทร์ - เสาร์ 8.00 - 17.00 น.<br/>
            วันหยุด วันอาทิตย์
          </p>
        </div>
        {/* Column 3: เกี่ยวกับเรา */}
        <div>
          <h4 className="text-micro-yellow text-2xl font-bold mb-5">เกี่ยวกับเรา</h4>
          <ul className="text-white space-y-3">
            <li><Link href="#" className="hover:underline">เกี่ยวกับเรา</Link></li>
            <li><Link href="#" className="hover:underline">ติดต่อเรา</Link></li>
            <li><Link href="#" className="hover:underline">ร่วมงานกับเรา</Link></li>
            <li><Link href="#" className="hover:underline">นักลงทุนสัมพันธ์</Link></li>
          </ul>
        </div>
        {/* Column 4: สินค้าและบริการ */}
        <div>
          <h4 className="text-micro-yellow text-2xl font-bold mb-5">สินค้าและบริการ</h4>
          <ul className="text-white space-y-3">
            <li><Link href="#" className="hover:underline">สินเชื่อซื้อขายรถยนต์ทุกประเภท</Link></li>
            <li><Link href="#" className="hover:underline">สินเชื่อเพิ่มสภาพคล่อง</Link></li>
            <li><Link href="#" className="hover:underline">รถพร้อมประมูล</Link></li>
            <li><Link href="#" className="hover:underline">สินเชื่อรถมอเตอร์ไซค์</Link></li>
            <li><Link href="#" className="hover:underline">บริการนายหน้าประกันภัย</Link></li>
          </ul>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="bg-[#f6f6f7] py-4 mt-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-micro-blue text-center text-sm sm:text-base md:text-lg gap-3">
          <div>
            © สงวนลิขสิทธิ์ พ.ศ. 2568 บริษัท ไมโครลิสซิ่ง จำกัด (มหาชน)
          </div>
          <div className="flex flex-wrap items-center gap-4 justify-center">
            <Link href="#" className="hover:underline">ข้อกำหนดและเงื่อนไข</Link>
            <span className="mx-1">|</span>
            <Link href="#" className="hover:underline">การคุ้มครองข้อมูลส่วนบุคคล</Link>
            <span className="mx-1">|</span>
            <Link href="#" className="hover:underline">นโยบายการใช้คุกกี้</Link>
            <span className="mx-1">|</span>
            <Link href="#" className="hover:underline">แผนผังเว็บไซต์</Link>
          </div>
        </div>
      </div>
      {/* Yellow Circle (ตกแต่ง) */}
      {/* <div className="hidden md:block absolute bottom-0 right-0 z-0">
        <svg width="340" height="340" viewBox="0 0 340 340" fill="none">
          <circle cx="260" cy="260" r="80" stroke="#FFD600" strokeWidth="20" fill="none"/>
        </svg>
      </div> */}
    </footer>
  )
}

export default Footer;
