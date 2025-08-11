"use client";
import React from "react";

const cards = [
  {
    staticImg: "/images/hero/Products-screen-1-img.png",
    animatedImg: "/images/hero/Products-screen-1.gif",
    title: "การพัฒนาและการออกแบบ",
  },
  {
    staticImg: "/images/hero/Products-screen-2-img.png",
    animatedImg: "/images/hero/Products-screen-2.gif",
    title: "เตรียมพิมพ์",
  },
  {
    staticImg: "/images/hero/Products-screen-3-img.png",
    animatedImg: "/images/hero/Products-screen-3.gif",
    title: "การพิมพ์",
  },
  {
    staticImg: "/images/hero/Products-screen-4-img.png",
    animatedImg: "/images/hero/Products-screen-4.gif",
    title: "หลังพิมพ์",
  },
];

const Dedicated = () => {
  return (
    <section className="relative bg-cover bg-center dark:bg-darkmode overflow-hidden py-10">
      {/* <div className="awe-parallax awe-static" />
      <div className="overlay-color-1" /> */}
      <div className="container mx-auto max-w-[1100px]">
        <h2
          className="text-center text-2xl font-bold mb-8 underline decoration-red-500 decoration-8"
          style={{ fontSize: "34px" }}>
          สินค้าและบริการของเรา
        </h2>
        <br />
        <br />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((item, i) => (
            <div
              key={i}
              className="group relative w-full h-[250px] shadow-lg rounded-[16px] overflow-hidden flex items-end cursor-pointer">
              {/* รูป static */}
              <img
                src={item.staticImg}
                alt="static"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
              />
              {/* รูป animated gif */}
              <img
                src={item.animatedImg}
                alt="animated"
                className="w-full h-full object-cover"
              />
              {/* title */}
              <p
                className="absolute bottom-0 left-0 m-2 text-white text-xl md:text-2xl lg:text-3xl font-extrabold drop-shadow-lg"
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
      </div>
    </section>
  );
};

export default Dedicated;
