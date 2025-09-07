"use client";
import React, { useEffect, useRef, useState } from "react";
import "animate.css";

// ====== Data ======
const cards = [
  {
    staticImg: "/images/hero/Products-screen-1-img.png",
    animatedImg: "/images/hero/Products-screen-1.gif",
    title: "การพัฒนาและการออกแบบ",
    subtitle: "Development & Design",
    gradient: "from-blue-600 to-cyan-600",
    icon: "🎨",
    description: "นวัตกรรมการออกแบบที่ทันสมัย",
  },
  {
    staticImg: "/images/hero/Products-screen-2-img.png",
    animatedImg: "/images/hero/Products-screen-2.gif",
    title: "เตรียมพิมพ์",
    subtitle: "Pre-Press",
    gradient: "from-cyan-600 to-teal-600",
    icon: "📐",
    description: "เตรียมความพร้อมอย่างมืออาชีพ",
  },
  {
    staticImg: "/images/hero/Products-screen-3-img.png",
    animatedImg: "/images/hero/Products-screen-3.gif",
    title: "การพิมพ์",
    subtitle: "Printing",
    gradient: "from-teal-600 to-green-600",
    icon: "🖨️",
    description: "คุณภาพการพิมพ์ระดับพรีเมียม",
  },
  {
    staticImg: "/images/hero/Products-screen-4-img.png",
    animatedImg: "/images/hero/Products-screen-4.gif",
    title: "หลังพิมพ์",
    subtitle: "Post-Press",
    gradient: "from-green-600 to-emerald-600",
    icon: "✨",
    description: "งานสำเร็จที่สมบูรณ์แบบ",
  },
];

// ====== Component ======
export default function ProductsAndServices() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const normalizeAni = (ani: string) => {
      const tokens = ani.trim().split(/\s+/).filter(Boolean);
      const out: string[] = [];
      let usesAnimate = false;

      tokens.forEach((t) => {
        if (t.startsWith("animate__")) {
          out.push(t);
          usesAnimate = true;
        } else if (t.startsWith("fx-")) {
          out.push(t);
        } else if (
          /^(fadeIn|fadeInUp|fadeInDown|fadeInLeft|fadeInRight|zoomIn|slideInUp|slideInDown|backInDown|backInUp|bounceIn|bounceInUp)$/i.test(
            t
          )
        ) {
          out.push(`animate__${t}`);
          usesAnimate = true;
        } else if (/^(slow|slower|fast|faster)$/i.test(t)) {
          out.push(`animate__${t}`);
          usesAnimate = true;
        } else if (/^delay-\d{2,4}ms$/i.test(t)) {
          out.push(`animate__${t}`);
          usesAnimate = true;
        } else {
          out.push(t);
        }
      });

      if (usesAnimate && !out.includes("animate__animated")) {
        out.push("animate__animated");
      }
      return out;
    };

    const els = root.querySelectorAll<HTMLElement>("[data-ani]");
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => {
        const classes = normalizeAni(el.dataset.ani || "");
        el.classList.add(...classes);
        el.classList.remove("opacity-0");
        el.style.transform = "none";
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const classes = normalizeAni(el.dataset.ani || "");
          if (entry.isIntersecting) {
            el.classList.remove(...classes);
            void el.offsetWidth;
            el.classList.add(...classes);
            el.classList.remove("opacity-0");
          } else {
            el.classList.remove(...classes);
            el.classList.add("opacity-0");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach((el) => {
      el.classList.add("opacity-0");
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  const motionVars = {
    ["--animate-duration" as any]: "0.8s",
    ["--animate-delay" as any]: "0s",
  } as React.CSSProperties;

  const baseDelay = 100;
  const step = 100;

  return (
    <section
      ref={sectionRef}
      data-products
      className="relative z-10 isolate overflow-hidden py-16 md:py-24 bg-white/5 backdrop-blur-sm"
      style={motionVars}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[150%] h-[150%] rounded-full bg-gradient-to-br from-blue-100/20 to-purple-100/20 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-1/2 -left-1/2 w-[150%] h-[150%] rounded-full bg-gradient-to-tr from-purple-100/20 to-blue-100/20 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gray-400/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-4 relative">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 opacity-0"
            data-ani="fadeInDown"
            style={{
              textShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            สินค้าและบริการของเรา
          </h2>
          <p
            className="text-lg md:text-xl text-gray-700 opacity-0"
            data-ani="fadeInUp"
            style={{ animationDelay: "200ms" }}
          >
            Our Products & Services
          </p>

          {/* Decorative Line */}
          <div
            className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mt-6 opacity-0"
            data-ani="fadeIn"
            style={{ animationDelay: "400ms" }}
          />
        </div>

        {/* Cards Grid */}
        <div className="grid justify-center gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((item, i) => (
            <div
              key={i}
              className="group relative opacity-0"
              data-ani="fadeInUp"
              style={{ animationDelay: `${baseDelay + i * step}ms` }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm bg-white/10 transform transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-80 transition-opacity duration-500 z-20`}
                />

                {/* Glass Effect Border */}
                <div className="absolute inset-0 rounded-2xl border border-white/30 group-hover:border-white/50 transition-colors duration-500 z-30" />

                {/* Images */}
                {item.animatedImg && (
                  <img
                    src={item.animatedImg}
                    alt={`${item.title} (animated)`}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    loading="lazy"
                  />
                )}

                <img
                  src={item.staticImg}
                  alt={item.title}
                  className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-700 ${
                    item.animatedImg ? "group-hover:opacity-0" : ""
                  }`}
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />

                {/* Icon Badge */}
                <div className="absolute top-4 right-4 w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-white/20 z-30">
                  <span className="text-3xl">{item.icon}</span>
                </div>

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                  {/* Description - appears on hover */}
                  <p className="text-white/90 text-sm mb-3 transform transition-all duration-500 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                    {item.description}
                  </p>

                  {/* Subtitle */}
                  <p className="text-white/70 text-sm mb-2 transform transition-all duration-500">
                    {item.subtitle}
                  </p>

                  {/* Main Title */}
                  <h3
                    className="text-white text-xl md:text-2xl font-bold transform transition-all duration-500"
                    style={{
                      textShadow:
                        "0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.1)",
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Action Arrow */}
                  <div className="mt-3 flex items-center text-white/80 transform transition-all duration-500 translate-x-0 group-hover:translate-x-2">
                    <span className="text-sm mr-2">ดูรายละเอียด</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-40">
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20" />
                </div>

                {/* Pulse Effect on Hover */}
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-1000 ${
                    hoveredIndex === i ? "animate-pulse" : ""
                  }`}
                >
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                </div>
              </div>

              {/* Card Shadow */}
              <div className="absolute -bottom-4 left-4 right-4 h-20 bg-black/10 blur-2xl rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-700" />
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <button
            className="relative px-10 py-4 bg-white/60 backdrop-blur-md text-gray-900 font-bold rounded-full border-2 border-gray-300/50 transform transition-all duration-500 hover:scale-105 hover:bg-white/80 hover:border-gray-400/60 hover:shadow-xl opacity-0 group overflow-hidden"
            data-ani="fadeInUp"
            style={{ animationDelay: "600ms" }}
          >
            {/* Button Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Button Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

            <span className="relative flex items-center text-lg">
              ดูผลิตภัณฑ์ทั้งหมด
              <svg
                className="w-5 h-5 ml-3 transform transition-transform group-hover:translate-x-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>

          <button
            className="relative px-10 py-4 bg-transparent text-gray-900 font-bold rounded-full border-2 border-gray-400/50 transform transition-all duration-500 hover:scale-105 hover:bg-white/40 hover:border-gray-500/60 opacity-0 group"
            data-ani="fadeInUp"
            style={{ animationDelay: "700ms" }}
          >
            <span className="relative flex items-center text-lg">
              ติดต่อเรา
              <svg
                className="w-5 h-5 ml-3 transform transition-transform group-hover:rotate-45"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
