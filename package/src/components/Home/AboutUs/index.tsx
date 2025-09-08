"use client";
import React, { useEffect, useRef } from "react";

interface AboutUsProps {
  // Add any props here if needed
}

const AboutUs: React.FC<AboutUsProps> = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const normalizeAni = (ani: string): string[] => {
      const tokens = ani.trim().split(/\s+/).filter(Boolean);
      const out: string[] = [];
      let usesAnimate = false;

      tokens.forEach((t) => {
        if (t.startsWith("animate__")) {
          out.push(t);
          usesAnimate = true;
        } else if (
          /^(fadeIn|fadeInUp|fadeInDown|fadeInLeft|fadeInRight|zoomIn|slideInUp|slideInDown)$/i.test(
            t
          )
        ) {
          out.push(`animate__${t}`);
          usesAnimate = true;
        } else if (/^(fast|faster|slow|slower)$/i.test(t)) {
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
        const aniValue = el.dataset.ani || "";
        const classes = normalizeAni(aniValue);
        el.classList.add(...classes);
        el.classList.remove("opacity-0");
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const aniValue = el.dataset.ani || "";
          const classes = normalizeAni(aniValue);
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
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate__fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .animate__fadeInRight {
          animation: fadeInRight 0.5s ease-out forwards;
        }

        .animate__faster {
          animation-duration: 0.4s;
        }

        .animate__slower {
          animation-duration: 0.6s;
        }

        /* Reduced delays for faster sequence */
        .animate__delay-50ms {
          animation-delay: 0.05s;
        }

        .animate__delay-100ms {
          animation-delay: 0.1s;
        }

        .animate__delay-150ms {
          animation-delay: 0.15s;
        }

        .animate__delay-200ms {
          animation-delay: 0.2s;
        }

        .animate__delay-250ms {
          animation-delay: 0.25s;
        }
      `}</style>

      <section ref={sectionRef} className="relative overflow-hidden bg-gray-50">
        {/* Background Image Container */}
        <div className="relative w-full">
          {/* Image that fills the container */}
          <img
            src="/images/team/ABOUT_BD_fix.png"
            alt="TPP Background"
            className="w-full h-full object-cover"
            style={{ minHeight: "527px" }}
          />

          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/40 md:from-white/90 md:via-white/60 md:to-transparent lg:from-transparent lg:via-transparent lg:to-transparent" />

          {/* Content positioned absolutely over the image */}
          <div className="absolute inset-0 flex items-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-[1800px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Content - Text */}
                <div className="w-full max-w-2xl">
                  {/* Main Title - Triggers immediately */}
                  <h1
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6 opacity-0"
                    data-ani="fadeInUp faster">
                    เกี่ยวกับ ไทยบรรจุภัณฑ์และการพิมพ์
                  </h1>

                  {/* Company Name - Very short delay */}
                  <div
                    className="mb-4 md:mb-6 opacity-0"
                    data-ani="fadeInUp faster delay-50ms">
                    <span className="text-red-600 font-bold text-lg sm:text-xl md:text-2xl inline-block">
                      TPP หรือ บริษัท ไทยบรรจุภัณฑ์และการพิมพ์ จำกัด (มหาชน)
                    </span>
                  </div>

                  {/* Description - Quick succession */}
                  <div className="space-y-3 md:space-y-4">
                    <p
                      className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed opacity-0"
                      data-ani="fadeInUp faster delay-100ms">
                      ผู้นำด้านการผลิต และออกแบบบรรจุภัณฑ์กระดาษลูกฟูก
                      และกล่องกระดาษแข็ง พร้อมงานพิมพ์ออฟเซ็ทคุณภาพสูง
                      ด้วยประสบการณ์ยาวนานกว่า 40 ปี เรามุ่งมั่นพัฒนานวัตกรรม
                    </p>

                    <p
                      className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed opacity-0"
                      data-ani="fadeInUp faster delay-150ms">
                      <span className="text-blue-600 font-semibold">
                        บรรจุภัณฑ์
                      </span>
                      และเทคโนโลยีการผลิตที่ทันสมัย
                      เพื่อตอบโจทย์ลูกค้าในอุตสาหกรรมต่างๆ เช่น อาหาร,
                      เครื่องดื่ม, และยานยนต์ โดยยึดมั่นในมาตรฐานสากล ISO
                      9001:2015 และ GMP/HACCP พร้อมทั้งให้ความสำคัญกับ{" "}
                      <span className="text-green-600 font-semibold">
                        บรรจุภัณฑ์ที่เป็นมิตรกับสิ่งแวดล้อม
                      </span>{" "}
                      เพื่อการเติบโตอย่างยั่งยืน
                    </p>
                  </div>

                  {/* Read More Button */}
                  <button
                    className="mt-6 md:mt-8 inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm sm:text-base md:text-lg opacity-0 group"
                    data-ani="fadeInUp faster delay-200ms"
                    onClick={() => (window.location.href = "/about-history")}>
                    อ่านต่อ
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Right side - Empty for showing background */}
                <div className="hidden lg:block"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile version - Remove duplicate content */}
        <style>{`
          @media (max-width: 1023px) {
            .absolute.inset-0 { display: flex !important; }
          }
          
          /* Extra small devices (phones, less than 360px) */
          @media (max-width: 359px) {
            .text-xs { font-size: 0.7rem; }
            .text-base { font-size: 0.875rem; }
          }
          
          /* Custom breakpoint for xs */
          @media (min-width: 360px) {
            .xs\\:text-sm { font-size: 0.875rem; }
            .xs\\:text-lg { font-size: 1.125rem; }
            .xs\\:text-2xl { font-size: 1.5rem; }
          }
        `}</style>
      </section>
    </>
  );
};

export default AboutUs;
