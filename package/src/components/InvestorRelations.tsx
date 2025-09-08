"use client";
import React, { useEffect, useRef, useState } from "react";
import "animate.css";

const data = [
  {
    title: "ข้อมูลทางการเงิน",
    subtitle: "Financial Information",
    staticImg: "/images/Header/IR-screen-1-img.png",
    animatedImg: "/images/Header/IR-screen-1.gif",
    gradient: "from-purple-600 to-blue-600",
    icon: "📊",
  },
  {
    title: "ข้อมูลราคาหลักทรัพย์",
    subtitle: "Stock Price Data",
    staticImg: "/images/Header/IR-screen-2-img.png",
    animatedImg: "/images/Header/IR-screen-2.gif",
    gradient: "from-blue-600 to-cyan-600",
    icon: "📈",
  },
  {
    title: "ข้อมูลผู้ถือหุ้น",
    subtitle: "Shareholder Information",
    staticImg: "/images/Header/IR-screen-3-img.png",
    animatedImg: "/images/Header/IR-screen-3.gif",
    gradient: "from-cyan-600 to-teal-600",
    icon: "👥",
  },
  {
    title: "รายงานประจำปี",
    subtitle: "Annual Report",
    staticImg: "/images/Header/IR-screen-4-img.png",
    animatedImg: "/images/Header/IR-screen-4.gif",
    gradient: "from-teal-600 to-green-600",
    icon: "📑",
  },
];

export default function InvestorRelations() {
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

      if (usesAnimate && !out.includes("animate__animated"))
        out.push("animate__animated");
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
      data-iri
      className="relative z-10 isolate overflow-hidden py-16 md:py-24"
      style={{
        ...motionVars,
        background: "linear-gradient(135deg, #ffffff00 0%, #ffffff00 100%)",
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[150%] h-[150%] rounded-full bg-white/5 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-1/2 -left-1/2 w-[150%] h-[150%] rounded-full bg-white/5 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-bounce"
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
            className="text-4xl md:text-6xl font-bold mb-4 opacity-100"
            style={{
              background: "linear-gradient(to right, #000, #000)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
              textShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            นักลงทุนสัมพันธ์
          </h2>
          <p
            className="text-lg md:text-xl text-black/80 opacity-0"
            data-ani="fadeInUp"
            style={{ animationDelay: "200ms" }}
          >
            Investor Relations Portal
          </p>

          {/* Decorative Line */}
          <div
            className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-6 opacity-0"
            data-ani="fadeIn"
            style={{ animationDelay: "400ms" }}
          />
        </div>

        {/* Cards Grid */}
        <div className="grid justify-center gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((item, i) => (
            <div
              key={i}
              className="group relative opacity-0"
              data-ani="fadeInUp"
              style={{ animationDelay: `${baseDelay + i * step}ms` }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700 hover:scale-105 hover:-translate-y-2">
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-90 transition-opacity duration-500 z-20`}
                />

                {/* Glass Effect Border */}
                <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/40 transition-colors duration-500 z-30" />

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

                {/* Icon */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 z-30">
                  <span className="text-2xl">{item.icon}</span>
                </div>

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                  <p
                    className="text-white/70 text-sm mb-2 transform transition-all duration-500 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
                    style={{
                      animationDelay: `${baseDelay + i * step + 100}ms`,
                    }}
                  >
                    {item.subtitle}
                  </p>
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
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-40`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20" />
                </div>
              </div>

              {/* Card Shadow */}
              <div className="absolute -bottom-4 left-4 right-4 h-20 bg-black/20 blur-2xl rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-700" />
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-12">
          <button
            className="relative px-10 py-4 bg-white/60 backdrop-blur-md text-gray-900 font-bold rounded-full border-2 border-gray-300/50 transform transition-all duration-500 hover:scale-105 hover:bg-white/80 hover:border-gray-400/60 hover:shadow-xl opacity-0 group overflow-hidden"
            data-ani="fadeInUp"
            style={{ animationDelay: "600ms" }}
          >
            {/* Button Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Button Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

            <span className="relative flex items-center text-lg">
              ดูข้อมูลทั้งหมด
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
        </div>
      </div>
    </section>
  );
}
