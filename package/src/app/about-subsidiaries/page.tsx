"use client";
import { useEffect, useState, useRef } from "react";

export default function OmanAirStyleLayout() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Zoom detection effect (same as before)
  useEffect(() => {
    const detectZoomLevel = () => {
      const vv = (window as any).visualViewport as VisualViewport | undefined;
      if (vv && vv.scale) {
        setZoomLevel(vv.scale);
        setViewportSize({ width: vv.width, height: vv.height });
        return vv.scale;
      }

      const zoom = window.devicePixelRatio || 1;
      setZoomLevel(zoom);

      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      return zoom;
    };

    detectZoomLevel();
    const handleResize = () => detectZoomLevel();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    const vv = (window as any).visualViewport as VisualViewport | undefined;
    if (vv) {
      vv.addEventListener("resize", handleResize);
      vv.addEventListener("scroll", handleResize);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "+" || e.key === "-" || e.key === "0")
      ) {
        setTimeout(detectZoomLevel, 100);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      if (vv) {
        vv.removeEventListener("resize", handleResize);
        vv.removeEventListener("scroll", handleResize);
      }
    };
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const elements = document.querySelectorAll("[data-aos]");
    elements.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const inverseZoom = 1 / zoomLevel;

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-neutral-100 p-0 ps">
      <style jsx>{`
        /* AOS-style Animations */
        [data-aos^="fade"][data-aos^="fade"] {
          opacity: 0;
          transition-property: opacity, transform;
          transition-duration: 600ms;
          transition-timing-function: cubic-bezier(0.39, 0.575, 0.565, 1);
        }

        [data-aos^="fade"][data-aos^="fade"].aos-animate {
          opacity: 1;
          transform: translateZ(0);
        }

        [data-aos="fade-up"] {
          transform: translate3d(0, 100px, 0);
        }

        [data-aos="fade-down"] {
          transform: translate3d(0, -100px, 0);
        }

        [data-aos="fade-right"] {
          transform: translate3d(-100px, 0, 0);
        }

        [data-aos="fade-left"] {
          transform: translate3d(100px, 0, 0);
        }

        [data-aos="fade-up-right"] {
          transform: translate3d(-100px, 100px, 0);
        }

        [data-aos="fade-up-left"] {
          transform: translate3d(100px, 100px, 0);
        }

        /* Zoom Animations */
        [data-aos^="zoom"][data-aos^="zoom"] {
          opacity: 0;
          transition-property: opacity, transform;
          transition-duration: 600ms;
          transition-timing-function: cubic-bezier(0.39, 0.575, 0.565, 1);
        }

        [data-aos^="zoom"][data-aos^="zoom"].aos-animate {
          opacity: 1;
          transform: translateZ(0) scale(1);
        }

        [data-aos="zoom-in"] {
          transform: scale(0.6);
        }

        [data-aos="zoom-in-up"] {
          transform: translate3d(0, 100px, 0) scale(0.6);
        }

        [data-aos="zoom-in-down"] {
          transform: translate3d(0, -100px, 0) scale(0.6);
        }

        [data-aos="zoom-in-right"] {
          transform: translate3d(-100px, 0, 0) scale(0.6);
        }

        [data-aos="zoom-in-left"] {
          transform: translate3d(100px, 0, 0) scale(0.6);
        }

        /* Slide Animations */
        [data-aos^="slide"][data-aos^="slide"] {
          transition-property: transform;
          transition-duration: 600ms;
          transition-timing-function: cubic-bezier(0.39, 0.575, 0.565, 1);
        }

        [data-aos^="slide"][data-aos^="slide"].aos-animate {
          transform: translateZ(0);
        }

        [data-aos="slide-up"] {
          transform: translate3d(0, 100%, 0);
        }

        [data-aos="slide-down"] {
          transform: translate3d(0, -100%, 0);
        }

        [data-aos="slide-right"] {
          transform: translate3d(-100%, 0, 0);
        }

        [data-aos="slide-left"] {
          transform: translate3d(100%, 0, 0);
        }

        /* Flip Animations */
        [data-aos^="flip"][data-aos^="flip"] {
          backface-visibility: hidden;
          transition-property: transform;
          transition-duration: 600ms;
          transition-timing-function: cubic-bezier(0.455, 0.03, 0.515, 0.955);
        }

        [data-aos="flip-left"] {
          transform: perspective(2500px) rotateY(-100deg);
        }

        [data-aos="flip-left"].aos-animate {
          transform: perspective(2500px) rotateY(0);
        }

        [data-aos="flip-right"] {
          transform: perspective(2500px) rotateY(100deg);
        }

        [data-aos="flip-right"].aos-animate {
          transform: perspective(2500px) rotateY(0);
        }

        [data-aos="flip-up"] {
          transform: perspective(2500px) rotateX(-100deg);
        }

        [data-aos="flip-up"].aos-animate {
          transform: perspective(2500px) rotateX(0);
        }

        /* Perfect Scrollbar Styles */
        .ps {
          overflow: hidden !important;
          overflow-anchor: none;
          -ms-overflow-style: none;
          touch-action: auto;
          -ms-touch-action: auto;
        }

        .ps::-webkit-scrollbar {
          display: none;
        }

        .ps__rail-x,
        .ps__rail-y {
          display: none;
          opacity: 0;
          position: absolute;
          transition: background-color 0.2s linear, opacity 0.2s linear;
        }

        .ps__rail-x {
          bottom: 0;
          height: 15px;
        }

        .ps__rail-y {
          right: 0;
          width: 15px;
        }

        .ps--active-x > .ps__rail-x,
        .ps--active-y > .ps__rail-y {
          display: block;
          background-color: transparent;
        }

        .ps:hover > .ps__rail-x,
        .ps:hover > .ps__rail-y,
        .ps--focus > .ps__rail-x,
        .ps--focus > .ps__rail-y {
          opacity: 0.6;
        }

        /* Zoom-resistant image styles */
        .zoom-immune-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 1rem;
          transform-origin: 0 0;
          will-change: transform;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background-image: url("/images/subsidiaries/Oman_Cargo_mapPx.png");
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          transform: scale(${inverseZoom});
          transform-origin: top left;
          width: ${100 * zoomLevel}%;
          height: ${100 * zoomLevel}%;
        }

        .fixed-aspect {
          position: relative;
          width: 100%;
          padding-top: 75%;
          overflow: hidden;
          border-radius: 1rem;
        }

        .fixed-aspect > * {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        /* Stagger animation delays */
        [data-aos][data-aos-delay="100"] {
          transition-delay: 100ms;
        }

        [data-aos][data-aos-delay="200"] {
          transition-delay: 200ms;
        }

        [data-aos][data-aos-delay="300"] {
          transition-delay: 300ms;
        }

        [data-aos][data-aos-delay="400"] {
          transition-delay: 400ms;
        }

        /* Custom smooth scroll */
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <section className="h-full w-full bg-white p-6 md:p-8">
        <div className="grid h-full items-stretch gap-6 lg:grid-cols-2">
          <div className="order-1 space-y-5 lg:order-1">
            {/* Company info card with fade-up animation */}
            <article
              id="company-card"
              data-aos="fade-up"
              data-aos-delay="100"
              className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/10 ${
                isVisible["company-card"] ? "aos-animate" : ""
              }`}>
              <h3 className="text-xl font-extrabold text-neutral-900">
                บริษัทในเครือ
              </h3>
              <div className="mt-2 text-base leading-6 text-neutral-700">
                <p>
                  บริษัท ทีพีพี อินเตอร์เนชั่นแนล จำกัด
                  <br />
                  ก่อตั้งเมื่อวันที่ 19 มกราคม พ.ศ. 2536
                  <br />
                  ทุนจดทะเบียน : 100 ล้านบาท (3 ล้านเหรียญสหรัฐ)
                  <br />
                  ทุนชำระแล้ว : 30 ล้านบาท (910,000 เหรียญสหรัฐ)
                  <br />
                  ประธาน : นายศุภพงศ์ อัศวินวิจิตร
                  <br />
                  กรรมการผู้จัดการ : นางสาวรัชนีวรรณ ลิ่วเฉลิมวงศ์
                  <br />
                  สำนักงานขายและบริการทั่วไปของโอมานแอร์ในประเทศไทย
                  (ตัวแทนพิเศษของโอมานแอร์คาร์โก้ในประเทศไทย)
                </p>
              </div>
            </article>

            {/* Contact info card with fade-up animation */}
            <article
              id="contact-card"
              data-aos="fade-up"
              data-aos-delay="200"
              className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/10 ${
                isVisible["contact-card"] ? "aos-animate" : ""
              }`}>
              <h3 className="text-xl font-extrabold text-neutral-900">
                กรุณาเยี่ยมชมเราได้ที่
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div
                  data-aos="fade-right"
                  data-aos-delay="300"
                  className={`text-base leading-6 text-neutral-700 ${
                    isVisible["contact-card"] ? "aos-animate" : ""
                  }`}>
                  <p>
                    www.omanair.com : Oman Air-Thai
                    <br />
                    สอบถามข้อมูลเพิ่มเติมได้ที่โทร (662) 175-2201-8
                    <br />
                    <br />
                    <strong>สำนักงาน</strong>
                    <br />
                    9/9 หมู่ 6 ถ.กิ่งแก้ว ต.ราชาเทวา อ.บางพลี
                    <br />
                    จ.สมุทรปราการ 10540
                    <br />
                    <br />
                    <strong>สำนักงานขนส่งสินค้า</strong>
                    <br />
                    36/152 RK BIZ Center ถนนด้านหน้าถนน
                    <br />
                    มอเตอร์เวย์-ร่มเกล้าแขวงคลองสาม เขตลาดกระบัง
                    <br />
                    กรุงเทพมหานคร ประเทศไทย
                    <br />
                    โทร: (662) 171-782
                  </p>
                </div>

                {/* Airplane image with zoom-in animation */}
                <div
                  id="plane-image"
                  data-aos="zoom-in"
                  data-aos-delay="400"
                  className={`fixed-aspect ${
                    isVisible["plane-image"] ? "aos-animate" : ""
                  }`}>
                  <div className="zoom-immune-container">
                    <svg
                      viewBox="0 0 400 300"
                      className="w-full h-full"
                      preserveAspectRatio="xMidYMid slice">
                      <image
                        href="/images/subsidiaries/Oman_Cargo_plane.png"
                        x="0"
                        y="0"
                        width="400"
                        height="300"
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Hero panel with slide animation */}
          <div
            id="hero-panel"
            data-aos="fade-left"
            data-aos-delay="200"
            className={`order-2 lg:order-2 h-full min-h-[400px] ${
              isVisible["hero-panel"] ? "aos-animate" : ""
            }`}>
            <div className="zoom-immune-container h-full">
              <div
                className="hero-background"
                role="img"
                aria-label="Oman Air Route Map"
                style={{
                  transform: `scale(${inverseZoom})`,
                  width: `${100 * zoomLevel}%`,
                  height: `${100 * zoomLevel}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Debug Panel with flip animation */}
      {zoomLevel !== 1 && (
        <div
          data-aos="flip-up"
          className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono aos-animate">
          <div>Zoom: {(zoomLevel * 100).toFixed(0)}%</div>
          <div>Inverse: {inverseZoom.toFixed(2)}</div>
          <div>
            Viewport: {viewportSize.width}x{viewportSize.height}
          </div>
        </div>
      )}
    </main>
  );
}
