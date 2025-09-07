"use client";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import "animate.css";

const Aboutus = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    // Enhanced animation normalizer with more effects
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
          /^(fadeIn|fadeInUp|fadeInDown|fadeInLeft|fadeInRight|zoomIn|slideInUp|slideInDown|backInDown|backInUp|bounceIn|bounceInUp|bounceInDown|flipInX|flipInY|rotateIn|jackInTheBox|rollIn|lightSpeedInRight|lightSpeedInLeft)$/i.test(
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
        const classes = normalizeAni(el.dataset.ani || "");
        el.classList.add(...classes);
        el.classList.remove("opacity-0");
        el.style.transform = "none";
      });
      return;
    }

    // Enhanced intersection observer with staggered animations
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          const el = entry.target as HTMLElement;
          const classes = normalizeAni(el.dataset.ani || "");

          if (entry.isIntersecting) {
            // Add stagger delay for sequential elements
            const staggerDelay = parseInt(el.dataset.stagger || "0");

            setTimeout(() => {
              el.classList.remove(...classes);
              void el.offsetWidth; // Force reflow
              el.classList.add(...classes);
              el.classList.remove("opacity-0");
              el.style.transform = "none";
            }, staggerDelay);

            setIsVisible(true);
          } else {
            el.classList.remove(...classes);
            el.classList.add("opacity-0");
          }
        });
      },
      {
        threshold: [0.1, 0.3, 0.5],
        rootMargin: "0px 0px -50px 0px",
      }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Inline styles as JavaScript object
  const sectionStyles = {
    backgroundImage: 'url("/images/team/ABOUT _BD.png")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "400px",
  };

  // CSS for animations that can't be inlined
  useEffect(() => {
    // Add style element for keyframe animations
    const styleId = "aboutus-animations";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes kenburnsIn {
          0% {
            transform: scale(1) translateX(0);
          }
          100% {
            transform: scale(1.1) translateX(-2%);
          }
        }
        
        .fx-kenburns-in {
          animation: kenburnsIn 15s ease-out infinite alternate;
        }
        
        .fx-kenburns-drift {
          animation: kenburnsIn 20s ease-in-out infinite alternate-reverse;
        }
        
        @keyframes underlineIn {
          0% {
            width: 0;
            opacity: 0;
          }
          100% {
            width: 6rem;
            opacity: 1;
          }
        }
        
        .fx-underline-in {
          animation: underlineIn 0.8s ease-out forwards;
        }
        
        @keyframes linkInRight {
          0% {
            transform: translateX(-20px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .fx-link-in-right {
          animation: linkInRight 0.6s ease-out forwards;
        }
        
        @keyframes subtleInUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .fx-subtle-in-up {
          animation: subtleInUp 0.8s ease-out forwards;
        }
        
        /* Responsive min-height adjustments */
        @media (min-width: 640px) {
          .about-section-responsive {
            min-height: 500px;
          }
        }
        
        @media (min-width: 768px) {
          .about-section-responsive {
            min-height: 600px;
            background-attachment: fixed;
          }
        }
        
        @media (min-width: 1024px) {
          .about-section-responsive {
            min-height: 700px;
          }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Cleanup on unmount
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={sectionStyles}
      data-ani="fx-kenburns-in fx-kenburns-drift"
      className="about-section-responsive relative overflow-hidden dark:bg-neutral-900"
    >
      {/* Enhanced gradient overlays for better text readability */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent dark:from-black/80 dark:via-black/60 dark:to-transparent md:from-white/85 md:via-white/50 lg:from-white/75 lg:via-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30 dark:to-black/40" />
      </div>

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center min-h-[70vh] sm:min-h-[65vh] md:min-h-[60vh] py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 gap-6 md:gap-8">
          {/* Content Column - Enhanced responsive sizing */}
          <div className="col-span-1 md:col-span-7 lg:col-span-6 xl:col-span-5 z-10">
            <div className="w-full max-w-[600px] md:max-w-none mx-auto md:mx-0">
              {/* Badge with animation */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 rounded-full mb-4 opacity-0"
                data-ani="bounceIn"
                data-stagger="0"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-xs font-semibold text-red-700 dark:text-red-300">
                  40+ ปีแห่งความเชี่ยวชาญ
                </span>
              </div>

              {/* Main heading with split text animation */}
              <h1 className="opacity-0" data-ani="fadeInUp" data-stagger="100">
                <span className="block text-[clamp(1.25rem,3.5vw,1.75rem)] sm:text-[clamp(1.5rem,4vw,2rem)] lg:text-[clamp(1.75rem,4.5vw,2.5rem)] font-bold leading-tight custom-Charcoal-gray dark:text-neutral-50">
                  <span
                    className="inline-block"
                    data-ani="rotateIn"
                    data-stagger="150"
                  >
                    เกี่ยวกับ
                  </span>
                  <span
                    className="inline-block ml-2 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600"
                    data-ani="flipInX"
                    data-stagger="200"
                  >
                    ไทยบรรจุภัณฑ์
                  </span>
                </span>
                <span
                  className="block text-[clamp(1.25rem,3.5vw,1.75rem)] sm:text-[clamp(1.5rem,4vw,2rem)] lg:text-[clamp(1.75rem,4.5vw,2.5rem)] font-bold custom-Charcoal-gray dark:text-neutral-50"
                  data-ani="fadeInUp"
                  data-stagger="250"
                >
                  และการพิมพ์
                </span>
              </h1>

              {/* Animated underline */}
              <div
                className="relative mt-3 mb-6 opacity-0"
                data-ani="fx-underline-in"
                data-stagger="300"
              >
                <span className="block h-1 w-24 bg-gradient-to-r from-red-500 to-red-700 rounded-full" />
                <span className="block h-1 w-16 bg-gradient-to-r from-red-300 to-red-500 rounded-full mt-2 ml-8 animate-pulse" />
              </div>

              {/* Enhanced description with better typography */}
              <div
                className="space-y-4 opacity-0"
                data-ani="fadeInUp"
                data-stagger="400"
              >
                <p className="text-[clamp(0.95rem,2.5vw,1.125rem)] sm:text-[clamp(1rem,3vw,1.1875rem)] leading-relaxed text-gray-700 dark:text-neutral-300">
                  <strong className="text-red-700 dark:text-red-400 font-bold text-[1.1em]">
                    TPP หรือ บริษัท ไทยบรรจุภัณฑ์และการพิมพ์ จำกัด (มหาชน)
                  </strong>
                </p>

                <p className="text-[clamp(0.95rem,2.5vw,1.125rem)] sm:text-[clamp(1rem,3vw,1.1875rem)] leading-relaxed text-gray-600 dark:text-neutral-400">
                  ผู้นำด้านการผลิตและออกแบบบรรจุภัณฑ์กระดาษลูกฟูก
                  และกล่องกระดาษแข็ง พร้อมงานพิมพ์ออฟเซ็ทคุณภาพสูง
                  ด้วยประสบการณ์ยาวนานกว่า{" "}
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    40 ปี
                  </span>
                </p>

                <p className="text-[clamp(0.95rem,2.5vw,1.125rem)] sm:text-[clamp(1rem,3vw,1.1875rem)] leading-relaxed text-gray-600 dark:text-neutral-400">
                  เรามุ่งมั่นพัฒนานวัตกรรมบรรจุภัณฑ์และเทคโนโลยีการผลิตที่ทันสมัย
                  เพื่อตอบโจทย์ลูกค้าในอุตสาหกรรมต่างๆ เช่น อาหาร, เครื่องดื่ม,
                  และยานยนต์ โดยยึดมั่นในมาตรฐานสากล ISO 9001:2015 และ GMP/HACCP
                  พร้อมทั้งให้ความสำคัญกับบรรจุภัณฑ์ที่เป็นมิตรกับสิ่งแวดล้อม
                  เพื่อการเติบโตอย่างยั่งยืน
                </p>
              </div>

              {/* Feature badges with staggered animation */}
              <div
                className="flex flex-wrap gap-2 mt-6 mb-6 opacity-0"
                data-ani="fadeInUp"
                data-stagger="500"
              >
                {["ISO 9001:2015", "GMP/HACCP", "Eco-Friendly"].map(
                  (badge, i) => (
                    <span
                      key={badge}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full opacity-0"
                      data-ani="bounceIn"
                      data-stagger={`${600 + i * 100}`}
                    >
                      <Icon
                        icon="tabler:certificate"
                        className="mr-1.5"
                        width={14}
                        height={14}
                      />
                      {badge}
                    </span>
                  )
                )}
              </div>

              {/* Enhanced CTA button with hover effects */}
              <Link
                href="/about-history"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 text-[clamp(0.95rem,2.5vw,1.125rem)] opacity-0"
                data-ani="lightSpeedInLeft"
                data-stagger="800"
              >
                <span>อ่านประวัติของเรา</span>
                <Icon
                  icon="tabler:arrow-right"
                  width={20}
                  height={20}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>

              {/* Stats row for mobile */}
              <div
                className="grid grid-cols-3 gap-4 mt-8 md:hidden opacity-0"
                data-ani="fadeInUp"
                data-stagger="900"
              >
                {[
                  { num: "40+", label: "ปีประสบการณ์" },
                  { num: "1000+", label: "ลูกค้า" },
                  { num: "100%", label: "คุณภาพ" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {stat.num}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Empty space for desktop layout */}
          <div className="hidden md:block md:col-span-5 lg:col-span-6 xl:col-span-7" />
        </div>
      </div>
    </section>
  );
};

export default Aboutus;
