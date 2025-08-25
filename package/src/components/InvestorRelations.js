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
    <section className="relative z-10 isolate bg-cover bg-center dark:bg-darkmode overflow-hidden py-10">
      <div className="mx-auto w-full max-w-[1400px] px-4">
        <h2 className="tpp-section-title"> นักลงทุนสัมพันธ์</h2>
        <br />
        <br />

        {/* คงที่ 320x420 และจัดให้การ์ดชิดกัน */}
        <div
          className="
            grid justify-center gap-3
            grid-cols-[repeat(auto-fit,minmax(320px,320px))]
          ">
          {data.map((item, i) => (
            <div
              key={i}
              className="
                group relative w-[320px] h-[420px]
                shadow-lg rounded-[16px] overflow-hidden cursor-pointer
              ">
              {item.animatedImg && (
                <img
                  src={item.animatedImg}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  loading="lazy"
                />
              )}

              <img
                src={item.staticImg}
                alt={item.title}
                className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300 ${
                  item.animatedImg ? "md:group-hover:opacity-0" : ""
                }`}
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent z-20" />

              <p
                className="
                  absolute bottom-0 left-0 m-3
                  text-white text-2xl md:text-3xl
                  font-extrabold drop-shadow-lg z-30
                "
                style={{
                  textShadow: `
                    2px 2px 6px rgba(0,0,0,0.8),
                    0px 0px 12px #fff,
                    0px 4px 16px rgba(0,0,0,0.8)
                  `,
                }}>
                {item.title}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button className="ir-btn ir-btn-glow">ดูทั้งหมด</button>
        </div>
      </div>
    </section>
  );
}
