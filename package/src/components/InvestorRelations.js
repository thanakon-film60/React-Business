import React from "react";

const data = [
  {
    title: "ข้อมูลทางการเงิน",
    img: "/images/Header/financial-info.webp",
  },
  {
    title: "ข้อมูลราคาหลักทรัพย์",
    img: "/images/Header/price-info.webp",
  },
  {
    title: "ข้อมูลผู้ถือหุ้น",
    img: "/images/Header/shareholder-info.jpg",
  },
  {
    title: "รายงานประจำปี",
    img: "/images/annual-report.jpg",
  },
];

export default function InvestorRelations() {
  return (
    <div className="ir-container">
      <h4
        className="text-center font-bold pb-4 underline decoration-red-500 decoration-8 "
        style={{ fontSize: "34px" }}
      >
        นักลงทุนสัมพันธ์
      </h4>
      <div className="ir-grid">
        {data.map((item, i) => (
          <div className="ir-card" key={i}>
            <img src={item.img} alt={item.title} className="ir-card-img" />
            <div className="ir-card-title">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
