// components/InvestorInfo/InvestorInfoGrid.jsx
"use client";
import React from "react";

const items = [
  {
    label: "ราคาหลักทรัพย์",
    icon: (
      <svg className="text-white w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="11" width="4" height="7" rx="1" />
        <rect x="9" y="7" width="4" height="11" rx="1" />
        <rect x="15" y="3" width="4" height="15" rx="1" />
      </svg>
    ),
    boxClass: "bg-white",
    iconBg: "bg-green-700",
    textClass: "text-green-800",
  },
  {
    label: "ข่าวแจ้งตลาดหลักทรัพย์",
    icon: (
      <svg className="text-white w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="M8 10h8" />
        <path d="M8 14h4" />
      </svg>
    ),
    boxClass: "bg-white",
    iconBg: "bg-green-700",
    textClass: "text-green-800",
  },
  {
    label: "ข้อมูลทางการเงิน",
    icon: (
      <svg className="text-white w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 9h8M8 13h6M8 17h4" />
      </svg>
    ),
    boxClass: "bg-white",
    iconBg: "bg-green-700",
    textClass: "text-green-800",
  },
  {
    label: "รายงานประจำปี",
    icon: (
      <svg className="text-white w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h6" />
      </svg>
    ),
    boxClass: "bg-white",
    iconBg: "bg-green-700",
    textClass: "text-green-800",
  },
  {
    label: "รายงานการพัฒนาอย่างยั่งยืน",
    icon: (
      <svg className="text-white w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 3v18M9 6h6M9 18h6" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    boxClass: "bg-white",
    iconBg: "bg-green-700",
    textClass: "text-green-800",
  },
  {
    label: "คำถามที่พบบ่อย",
    icon: (
      <svg className="text-green-800 w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 1 1 2.91 4v1" />
        <rect x="11" y="17" width="2" height="2" rx="1" />
      </svg>
    ),
    boxClass: "bg-green-800",
    iconBg: "bg-white",
    textClass: "text-white",
  },
];

export default function InvestorInfoGrid() {
  return (
    <div className="bg-[#f8f9f9] min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-6">ข้อมูลสำหรับนักลงทุน</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`${item.boxClass} rounded-lg shadow flex items-center p-6 gap-4`}
          >
            <div
              className={`${item.iconBg} rounded-full w-16 h-16 flex items-center justify-center`}
            >
              {item.icon}
            </div>
            <div className={`${item.textClass} font-medium`}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
