"use client";
import React from "react";

const data = [
  {
    title: "ข้อมูลทางการเงิน",
    staticImg: "/images/Header/IR-screen-1-img.png",
    animatedImg: "/images/Header/IR-screen-1.gif", 
  },
  {
    title: "ข้อมูลราคาหลักทรัพย์",
    staticImg: "/images/Header/IR-screen-2-img.png",
    animatedImg: "/images/Header/IR-screen-2.gif", 
  },
  {
    title: "ข้อมูลผู้ถือหุ้น",
    staticImg: "/images/Header/IR-screen-3-img.png",
    animatedImg: "/images/Header/IR-screen-3.gif", 
  },
  {
    title: "รายงานประจำปี",
    staticImg: "/images/Header/IR-screen-4-img.png",
    animatedImg: "/images/Header/IR-screen-4.gif", 
  },
];

export default function InvestorRelations() {
  return (
    <section className="relative bg-cover bg-center dark:bg-darkmode overflow-hidden py-10" style={{height:"730px"}}>
      <div className="container mx-auto max-w-[1100px]">
        <h2 className="text-center text-2xl font-bold mb-8 underline decoration-red-500 decoration-8" style={{ fontSize: "34px" }}>
          นักลงทุนสัมพันธ์
        </h2>
        <br />
        <br />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, i) => (
            <div
              key={i}
              className="group relative w-full h-[250px] shadow-lg rounded-[16px] overflow-hidden flex items-end cursor-pointer"
            >
              {/* Static Image */}
              <img
                src={item.staticImg}
                alt={item.title}
                className={`absolute inset-0 w-full h-full object-cover
                  transition-opacity duration-300
                  ${item.animatedImg ? "group-hover:opacity-0" : ""}
                `}
              />
              {/* Animated Image (show only if animatedImg exists) */}
              {item.animatedImg && (
                <img
                  src={item.animatedImg}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              )}
              {/* Title */}
              <p
                className="absolute bottom-0 left-0 m-2 text-white text-xl md:text-2xl lg:text-3xl font-extrabold drop-shadow-lg"
                style={{
                  textShadow: `
                    2px 2px 6px rgba(0,0,0,0.8),
                    0px 0px 12px #fff,
                    0px 4px 16px rgba(0,0,0,0.8)
                  `,
                }}
              >
                {item.title}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button className="ir-btn ir-btn-glow">
            ดูทั้งหมด
          </button>
        </div>
      </div>
    </section>
  );
}
