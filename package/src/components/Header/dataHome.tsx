import HeaderMenu, { MenuItem } from "./HeaderMenu";
import Logo from "../Layout/Header/Logo/index"; // เปลี่ยน path ตามจริง

// ตัวอย่างเมนู
const menu1: MenuItem[] = [
    { label: "หน้าหลัก", href: "/#" },
  {
    label: "เกี่ยวกับเรา",
    href: "#",
    submenu: [
      { label: "ปรัชญา วิสัยทัศน์ และพันธกิจ", href: "/about-philosophy" },
      { label: "ประวัติองค์กร", href: "/about-history" },
      { label: "คณะกรรมการ / ผู้บริหาร", href: "/about-executives" },
      { label: "บริษัทในเครือ", href: "/about-subsidiaries" },
    ],
  },
  {
    label: "สินค้าและบริการ",
    href: "#",
    submenu: [
      { label: "สินค้า - ภายใต้แบรนด์ Pakku Packaging", href: "/products-pakku-packaging" },
      { label: "บริการของเรา", href: "/our-services" },
      { label: "ลูกค้าของเรา", href: "/our-customers" },
    ],
  },
  {
    label: "โรงงานและมาตรฐาน",
    href: "#",
    submenu: [
      { label: "เครื่องพิมพ์และเทคโนโลยี", href: "/factory-technology" },
      { label: "การควบคุมคุณภาพ", href: "/quality-control" },
      { label: "การรับรองคุณภาพ", href: "/quality-certification" },
      { label: "รางวัลและความภาคภูมิใจ", href: "/awards-achievements" },
    ],
  },
];

const menu2: MenuItem[] = [
{ label: "ข่าวสารและกิจกรรม", href: "/news-events" },
{ label: "บทความ", href: "/news-events" },
  {
  label: "นักลงทุนสัมพันธ์",
  href: "#",
  submenu: [
    { label: "ข้อมูลทางการเงิน", href: "/investor-financials" },
    { label: "การกำกับดูแลกิจการที่ดี", href: "/investor-governance" },
    { label: "ข้อมูลผู้ถือหุ้น", href: "/investor-shareholders" },
    { label: "เอกสารเผยแพร่และดาวน์โหลด", href: "/investor-downloads" },
    { label: "ติดต่อนักลงทุนสัมพันธ์", href: "/investor-contact" },
  ],
},
  {
  label: "ติดต่อเรา",
  href: "#",
  submenu: [
    { label: "ร่วมงานกับเรา", href: "/careers" },
    { label: "ติดต่อสอบถาม", href: "/contact-inquiry" },
  ],
},
];

const HeaderList: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 border-b border-black/60 bg-white">
    <div className="container-fluid">
      <div className="d-flex align-items-center w-100 px-md-3 px-lg-4" style={{ height: 120 }}>
        {/* เมนูซ้าย */}
        <HeaderMenu menu={menu1} justify="end" />
        {/* LOGO */}
        <div className="d-flex align-items-center justify-content-center flex-shrink-0">
          <Logo />
        </div>
        {/* เมนูขวา */}
        <HeaderMenu menu={menu2} justify="start" />
      </div>
    </div>
  </header>
);

export default HeaderList;
