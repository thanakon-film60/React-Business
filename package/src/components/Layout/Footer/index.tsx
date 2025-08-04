import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

const Footer = () => {
  return (
    <footer className="position-relative footer-custom bg-danger footer-img1">
      {/* กล่องเนื้อหาหลัก */}
      <div className="container">
        <div className="row gy-4 gx-4 align-items-start bg-opacity-10 rounded-4 p-4 my-4 text-break">
          {/* โลโก้ */}
          <div className="col-12 col-md-2 d-flex justify-content-md-end mb-3 mb-md-0">
            <Image src="/images/logo/logo.png" alt="Micro Leasing Logo" width={64} height={64} />
          </div>

          {/* ที่อยู่/ติดตามเรา */}
          <div className="col-12 col-md-3">
            <h4 className="text-primary custom-grey fw-bold mb-2">
              บริษัท ไทยบรรจุภัณฑ์และการพิมพ์ จำกัด (มหาชน)
            </h4>
            <p className="text-white mb-2" style={{ fontSize: '1rem' }}>
              9/9 หมู่ 6 ถนนกิ่งแก้ว<br />
              ตำบลราชาเทวะ อำเภอบางพลี<br />
              จังหวัดสมุทรปราการ 10540.
            </p>
            <h5 className="text-primary custom-grey fw-bold mb-2">ติดตามเรา</h5>
            <div className="d-flex gap-3">
              <Link href="#"><Icon icon="ic:baseline-facebook" fontSize={24} className="text-white" /></Link>
              <Link href="#"><Icon icon="simple-icons:line" fontSize={24} className="text-white" /></Link>
              <Link href="#"><Icon icon="mdi:youtube" fontSize={24} className="text-white" /></Link>
            </div>
          </div>

          {/* ติดต่อสอบถาม/เวลาทำการ */}
          <div className="col-12 col-md-3">
            <h4 className="text-primary custom-grey fw-bold mb-2">ติดต่อสอบถาม</h4>
            <p className="text-white mb-1" style={{ fontSize: '1rem' }}>
              02-175-2201-8<br />
              Contact@microleasingplc.com
            </p>
            <h5 className="text-primary custom-grey fw-bold mb-2 mt-3">เวลาทำการ</h5>
            <p className="text-white mb-0" style={{ fontSize: '1rem' }}>
              จันทร์ - เสาร์ 8.30 - 17.30 น.<br />
              วันหยุด วันอาทิตย์
            </p>
          </div>

          {/* เกี่ยวกับเรา/สินค้าและบริการ */}
          <div className="col-12 col-md-3">
            <div className="row">
              {/* เกี่ยวกับเรา */}
              <div className="col-6">
                <h4 className="text-primary custom-grey  fw-bold mb-2">เกี่ยวกับเรา</h4>
                <ul className="list-unstyled text-white">
                  <li><Link href="#" className="text-white text-decoration-none">เกี่ยวกับเรา</Link></li>
                  <li><Link href="#" className="text-white text-decoration-none">ติดต่อเรา</Link></li>
                  <li><Link href="#" className="text-white text-decoration-none">ร่วมงานกับเรา</Link></li>
                  <li><Link href="#" className="text-white text-decoration-none">นักลงทุนสัมพันธ์</Link></li>
                </ul>
              </div>
              {/* สินค้าและบริการ */}
              <div className="col-6">
                <h4 className="text-primary custom-grey fw-bold mb-2">สินค้าและบริการ</h4>
                <ul className="list-unstyled text-white">
                  <li><Link href="#" className="text-white text-decoration-none">บริการของเรา</Link></li>
                  <li><Link href="#" className="text-white text-decoration-none">Pakku Packaging</Link></li>
                </ul>
              </div>
              
            </div>
          </div>
        </div>
        
      </div>

      {/* Bottom Bar */}
      <div className="bg-white py-3">
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between custom-grey text-center text-sm gap-2">
          <div>
            © สงวนลิขสิทธิ์ พ.ศ. 2568 บริษัท ไทยบรรจุภัณฑ์และการพิมพ์ จำกัด (มหาชน)
          </div>
          <div>
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link href="#" className="custom-grey text-decoration-underline">ข้อกำหนดและเงื่อนไข</Link>
              </li>
              <li className="list-inline-item">|</li>
              <li className="list-inline-item">
                <Link href="#" className="custom-grey text-decoration-underline">การคุ้มครองข้อมูลส่วนบุคคล</Link>
              </li>
              <li className="list-inline-item">|</li>
              <li className="list-inline-item">
                <Link href="#" className="custom-grey text-decoration-underline">นโยบายการใช้คุกกี้</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
