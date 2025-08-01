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
    <section className="relative bg-cover bg-center dark:bg-darkmode overflow-hidden py-10">
      <div className="container mx-auto max-w-[1100px]">
        <h2 className="text-center text-2xl font-bold mb-8 underline decoration-red-500 decoration-8" style={{ fontSize: "34px" }}>
          นักลงทุนสัมพันธ์
        </h2>
        <br />
        <br />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, i) => (
            <div key={i} className="relative w-full h-[250px] shadow-lg rounded-[16px] overflow-hidden flex items-end cursor-pointer">
              <img
                src={item.img}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
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
          <button className="px-8 py-2 bg-yellow-400 rounded-full shadow font-bold hover:bg-yellow-500 transition">
            ดูทั้งหมด
          </button>
        </div>
      </div>
    </section>
  );
}
