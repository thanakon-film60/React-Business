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
      <div className="awe-parallax awe-static" />
      <div className="overlay-color-1" />

      <div className="mx-auto w-full max-w-[1400px] px-4">
        <h2 className="tpp-section-title">สินค้าและบริการของเรา</h2>
        <br />
        <br />

        <div
          className="
            grid justify-center
            gap-2 md:gap-3
            grid-cols-[repeat(auto-fit,minmax(320px,320px))]
          ">
          {cards.map((item, i) => (
            <div
              key={i}
              className="
                group relative w-[320px] h-[420px]
                shadow-lg rounded-[16px] overflow-hidden cursor-pointer
              ">
              <img
                src={item.animatedImg}
                alt={`${item.title} (animated)`}
                className="absolute inset-0 w-full h-full object-cover z-0"
                loading="lazy"
              />
              <img
                src={item.staticImg}
                alt={`${item.title} (static)`}
                className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300 group-hover:opacity-0 will-change-[opacity]"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent z-20" />
              <p
                className="absolute bottom-0 left-0 m-3 text-white text-xl md:text-2xl font-extrabold drop-shadow-lg z-30"
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
