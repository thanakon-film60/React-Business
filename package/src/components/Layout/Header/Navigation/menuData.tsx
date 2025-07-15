import { HeaderItem } from "@/types/menu";

export const headerData: HeaderItem[] = [
  {
    label: "เกี่ยวกับเรา",
    href: "#",
    submenu: [
      { label: "ปรัชญา วิสัยทัศน์ และพันธกิจ", href: "/about-philosophy" },
      { label: "ประวัติองค์กร", href: "/about-history" },
      { label: "สารจากกรรมการผู้จัดการ", href: "/about-message" },
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
  { label: "ข่าวสารและกิจกรรม-บทความ", href: "#" },
  { label: "นักลงทุนสัมพันธ์", href: "/documentation" },
  { label: "ติดต่อเรา", href: "" },
];
