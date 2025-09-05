import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Calendar,
  ArrowRight,
  MoveHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Types
interface CardData {
  date: string;
  title: string;
  image: string;
}

interface CardItemProps extends CardData {
  active: boolean;
  hovered: boolean;
  index: number;
  totalCards: number;
}

// Responsive breakpoints
function computeCardsPerPage(w: number): number {
  if (w < 480) return 1;
  if (w < 768) return 2;
  if (w < 1024) return 3;
  if (w < 1440) return 4;
  return 5;
}

// CardItem Component
const CardItem: React.FC<CardItemProps> = ({
  date,
  title,
  image,
  active,
  hovered,
  index,
  totalCards,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.animation = "none";
      cardRef.current.offsetHeight;
      cardRef.current.style.animation = `slideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${
        index * 100
      }ms both`;
    }
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`
        relative overflow-hidden rounded-xl bg-white
        transform transition-all duration-700 ease-out select-none
        ${
          active
            ? "scale-[1.03] shadow-2xl ring-2 ring-blue-400/40"
            : "scale-100 shadow-md hover:shadow-lg"
        }
        ${hovered && !active ? "scale-[1.01] shadow-lg -translate-y-1" : ""}
        cursor-pointer will-change-transform
        w-full max-w-[388px] mx-auto
      `}>
      {/* Gradient Overlay for Active State */}
      <div
        className={`
        absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent 
        transition-opacity duration-500 z-10 pointer-events-none
        ${active ? "opacity-100" : "opacity-0"}
      `}
      />

      {/* Subtle Glow Effect */}
      {active && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl blur-lg opacity-50 -z-10" />
      )}

      {/* Image Container - Fixed Aspect Ratio 388×291 (4:3) */}
      <div className="relative w-full aspect-[388/291] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <div
          className={`
          absolute inset-0 transition-transform duration-1000 ease-out
          ${active ? "scale-105" : "scale-100"}
          ${hovered && !active ? "scale-102" : ""}
        `}>
          <img
            src={image}
            alt={title}
            className={`
              w-full h-full object-cover transition-opacity duration-700
              ${isImageLoaded ? "opacity-100" : "opacity-0"}
            `}
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Loading Shimmer */}
        {!isImageLoaded && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
          </div>
        )}

        {/* Date Badge */}
        <div
          className={`
          absolute top-3 left-3 px-2.5 py-1 rounded-full
          bg-white/95 backdrop-blur-sm shadow-md
          transform transition-all duration-500 flex items-center gap-1.5
          ${
            active
              ? "translate-x-0 opacity-100 scale-100"
              : "-translate-x-1 opacity-90 scale-95"
          }
        `}>
          <Calendar className="w-3 h-3 text-blue-600" />
          <span className="text-[11px] sm:text-xs font-medium text-gray-700">
            {date}
          </span>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3
          className={`
          font-semibold text-gray-800 line-clamp-2 sm:line-clamp-3 transition-all duration-500
          text-sm sm:text-[15px] leading-snug sm:leading-relaxed min-h-[2.5rem] sm:min-h-[3.5rem]
          ${active ? "text-blue-600" : ""}
        `}>
          {title}
        </h3>

        {/* Read More */}
        <div
          className={`
          mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm font-medium transition-all duration-300
          ${active ? "text-blue-600" : "text-gray-500"}
          group
        `}>
          <span>อ่านต่อ</span>
          <ArrowRight
            className={`
            w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300
            ${
              active || hovered
                ? "translate-x-1 text-blue-600"
                : "translate-x-0"
            }
          `}
          />
        </div>
      </div>

      {/* Bottom Border Animation */}
      <div
        className={`
        absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500
        transform transition-all duration-700 origin-left
        ${active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}
      `}
      />
    </div>
  );
};

const TabPage: React.FC = () => {
  const newsData: CardData[] = [
    {
      date: "15 สิงหาคม 2567",
      title:
        "ซ้อมดับเพลิงประจำปี เพื่อเสริมสร้างความพร้อมรับมือเหตุฉุกเฉินอย่างมีประสิทธิภาพ สร้างจิตสำนึกด้านความปลอดภัย และความร่วมมือในการป้องกันอัคคีภัยในสถานที่ทำงาน",
      image: "/images/New/Annual_Fire_Drill.png",
    },
    {
      date: "23 พฤษภาคม 2568",
      title:
        "ทำบุญประจำปี 2568 เนื่องในโอกาสก้าวเข้าสู่ปีที่ 37 แห่งการดำเนินธุรกิจ ได้จัดกิจกรรมทำบุญประจำปี ณ บริเวณโรงอาหาร เพื่อเสริมสิริมงคลแก่คณะผู้บริหารและพนักงาน",
      image: "/images/New/Company_Merit-Making_Ceremony.png",
    },
    {
      date: "1 กรกฎาคม 2568",
      title:
        "กิจกรรมสวัสดิการ 'แจกสิ่งของอุปโภคบริโภค' ประจำไตรมาส 2/2568 TPP จัดกิจกรรมมอบสิ่งของอุปโภคบริโภคให้แก่พนักงาน",
      image: "/images/New/Distribution_of_Consumer_Goods.png",
    },
    {
      date: "06 พฤษภาคม 2568",
      title:
        "ประชุมคณะกรรมการบริหาร – รวมพลังขับเคลื่อนองค์กรสู่ความสำเร็จ เสริมสร้างวิสัยทัศน์ร่วม และกำหนดทิศทางการเติบโตอย่างยั่งยืน",
      image: "/images/New/Board_of_Directors_Meeting.png",
    },
    {
      date: "03 เมษายน 2568",
      title: "กิจกรรมพัฒนาทีมงาน Team Building Activity ประจำปี 2568",
      image: "/images/New/Dev_Size.png",
    },
    {
      date: "20 มีนาคม 2568",
      title: "อบรมหลักสูตรพัฒนาผู้นำ Leadership Development Program",
      image: "/images/New/Dev_Size.png",
    },
    {
      date: "15 มีนาคม 2568",
      title: "โครงการ CSR มอบทุนการศึกษาแก่เยาวชนในชุมชน",
      image: "/images/New/Dev_Size.png",
    },
    {
      date: "10 มีนาคม 2568",
      title: "พิธีมอบรางวัลพนักงานดีเด่นประจำปี 2567",
      image: "/images/New/Dev_Size.png",
    },
  ];

  const articleData: CardData[] = [
    {
      date: "13 มิถุนายน 2568",
      title: "เทคนิคการบริหารเวลาอย่างมีประสิทธิภาพ สำหรับคนทำงานยุคใหม่",
      image: "/images/New/Dev_Size.png",
    },
    {
      date: "06 มิถุนายน 2568",
      title: "5 ทักษะสำคัญที่ต้องมีในยุคดิจิทัล Digital Skills for Future",
      image: "/images/New/Dev_Size.png",
    },
    {
      date: "30 พฤษภาคม 2568",
      title:
        "การสร้างวัฒนธรรมองค์กรที่ยั่งยืน Building Sustainable Corporate Culture",
      image: "/images/New/Dev_Size.png",
    },
    {
      date: "23 พฤษภาคม 2568",
      title: "นวัตกรรมการทำงานแบบ Hybrid Working Model",
      image: "/images/New/Dev_Size.png",
    },
    {
      date: "16 พฤษภาคม 2568",
      title: "Work-Life Balance กุญแจสู่ความสุขในการทำงาน",
      image: "/images/New/Dev_Size.png",
    },
  ];

  const [activeTab, setActiveTab] = useState<"news" | "article">("news");
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const autoSlideRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const data = activeTab === "news" ? newsData : articleData;
  const maxIndex = useMemo(
    () => Math.max(0, data.length - cardsPerPage),
    [data.length, cardsPerPage]
  );

  // Responsive cards per page
  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return;
      setCardsPerPage(computeCardsPerPage(window.innerWidth));
    };
    update();

    const onResize = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(update, 100);
    };

    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Reset active index
  useEffect(() => {
    setActiveIndex(0);
  }, [slideIndex, activeTab]);

  // Adjust slide index
  useEffect(() => {
    setSlideIndex((i) => (i > maxIndex ? maxIndex : i));
  }, [maxIndex, activeTab]);

  // Auto slide
  useEffect(() => {
    const startAutoSlide = () => {
      if (maxIndex === 0) return;

      clearInterval(autoSlideRef.current);
      autoSlideRef.current = setInterval(() => {
        setSlideIndex((current) => {
          const next = current >= maxIndex ? 0 : current + 1;
          return next;
        });
      }, 5000);
    };

    if (!isDragging && !isTransitioning) {
      startAutoSlide();
    }

    return () => clearInterval(autoSlideRef.current);
  }, [isDragging, isTransitioning, maxIndex]);

  // Handle swipe/drag
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setStartX("touches" in e ? e.touches[0].clientX : e.clientX);
    setCurrentX("touches" in e ? e.touches[0].clientX : e.clientX);
    clearInterval(autoSlideRef.current);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    setCurrentX(x);
    const diff = x - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const threshold = 50;
    const diff = currentX - startX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && slideIndex > 0) {
        handleSlide(slideIndex - 1);
      } else if (diff < 0 && slideIndex < maxIndex) {
        handleSlide(slideIndex + 1);
      }
    }

    setDragOffset(0);
  };

  const handleSlide = (newIndex: number) => {
    if (isTransitioning || newIndex < 0 || newIndex > maxIndex) return;

    setIsTransitioning(true);
    setSlideIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleTabChange = (newTab: "news" | "article") => {
    if (activeTab === newTab) return;
    setIsTransitioning(true);
    setActiveTab(newTab);
    setSlideIndex(0);
    setActiveIndex(0);
    setDragOffset(0);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-6 max-w-[1600px] mx-auto py-6 sm:py-8 lg:py-10 overflow-hidden">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideHint {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Tabs */}
      <div className="flex justify-center gap-3 sm:gap-6 mb-6 sm:mb-8 lg:mb-10">
        <button
          className={`
            relative px-4 sm:px-6 lg:px-8 py-2 sm:py-3 font-bold text-sm sm:text-base lg:text-lg transition-all duration-500
            ${
              activeTab === "news"
                ? "text-red-600 scale-105"
                : "text-gray-500 hover:text-gray-700 scale-100"
            }
          `}
          onClick={() => handleTabChange("news")}>
          <span className="relative z-10">ข่าวสารและกิจกรรม</span>
          <div
            className={`
            absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 rounded-full
            bg-gradient-to-r from-red-400 via-red-500 to-red-600
            transform transition-all duration-500 origin-center
            ${
              activeTab === "news"
                ? "scale-x-100 opacity-100"
                : "scale-x-0 opacity-0"
            }
          `}
          />
          {activeTab === "news" && (
            <>
              <div
                className="absolute inset-0 bg-red-50 rounded-lg opacity-30 sm:opacity-50 -z-10"
                style={{ animation: "fadeIn 0.5s" }}
              />
              <div className="absolute -inset-2 bg-red-200/10 sm:bg-red-200/20 rounded-lg blur-xl -z-20" />
            </>
          )}
        </button>

        <button
          className={`
            relative px-4 sm:px-6 lg:px-8 py-2 sm:py-3 font-bold text-sm sm:text-base lg:text-lg transition-all duration-500
            ${
              activeTab === "article"
                ? "text-red-600 scale-105"
                : "text-gray-500 hover:text-gray-700 scale-100"
            }
          `}
          onClick={() => handleTabChange("article")}>
          <span className="relative z-10">บทความ</span>
          <div
            className={`
            absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 rounded-full
            bg-gradient-to-r from-red-400 via-red-500 to-red-600
            transform transition-all duration-500 origin-center
            ${
              activeTab === "article"
                ? "scale-x-100 opacity-100"
                : "scale-x-0 opacity-0"
            }
          `}
          />
          {activeTab === "article" && (
            <>
              <div
                className="absolute inset-0 bg-red-50 rounded-lg opacity-30 sm:opacity-50 -z-10"
                style={{ animation: "fadeIn 0.5s" }}
              />
              <div className="absolute -inset-2 bg-red-200/10 sm:bg-red-200/20 rounded-lg blur-xl -z-20" />
            </>
          )}
        </button>
      </div>

      {/* Swipe Hint (mobile) */}
      <div className="sm:hidden flex items-center justify-center gap-2 mb-3 text-gray-500 text-xs">
        <MoveHorizontal
          className="w-3.5 h-3.5"
          style={{ animation: "slideHint 2s infinite" }}
        />
        <span>เลื่อนซ้าย-ขวาเพื่อดูเพิ่มเติม</span>
      </div>

      {/* Main Content Container */}
      <div className="relative" ref={containerRef}>
        {/* Navigation Buttons (Desktop) */}
        {maxIndex > 0 && (
          <>
            <button
              className={`
                hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20
                w-10 h-10 lg:w-12 lg:h-12 items-center justify-center
                bg-white/90 backdrop-blur-sm shadow-lg rounded-full
                hover:bg-white hover:scale-110 transition-all duration-300
                ${
                  slideIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100"
                }
              `}
              onClick={() => handleSlide(slideIndex - 1)}
              disabled={slideIndex === 0 || isTransitioning}
              aria-label="Previous">
              <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>

            <button
              className={`
                hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20
                w-10 h-10 lg:w-12 lg:h-12 items-center justify-center
                bg-white/90 backdrop-blur-sm shadow-lg rounded-full
                hover:bg-white hover:scale-110 transition-all duration-300
                ${
                  slideIndex === maxIndex
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100"
                }
              `}
              onClick={() => handleSlide(slideIndex + 1)}
              disabled={slideIndex === maxIndex || isTransitioning}
              aria-label="Next">
              <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </>
        )}

        {/* Swipeable Slider */}
        <div
          ref={sliderRef}
          className="relative overflow-hidden touch-pan-y px-0 sm:px-14"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}>
          {/* Cards Container */}
          <div
            className={`
              flex gap-3 sm:gap-4 lg:gap-6 transition-transform
              ${isDragging ? "duration-0" : "duration-600 ease-out"}
            `}
            style={{
              transform: `translateX(calc(-${
                slideIndex * (100 / cardsPerPage)
              }% - ${
                slideIndex * (cardsPerPage > 1 ? 12 : 0)
              }px + ${dragOffset}px))`,
            }}>
            {data.map((item, idx) => {
              const groupIndex = Math.floor(idx / cardsPerPage);
              const indexInGroup = idx % cardsPerPage;
              const isActive =
                slideIndex === groupIndex && activeIndex === indexInGroup;
              const isHovered =
                slideIndex === groupIndex && hoverIndex === indexInGroup;
              const isVisible =
                idx >= slideIndex && idx < slideIndex + cardsPerPage;

              return (
                <div
                  key={idx}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] 2xl:w-[calc(20%-19.2px)] max-w-[388px]"
                  onClick={() => {
                    if (isVisible) {
                      setActiveIndex(indexInGroup);
                    }
                  }}
                  onMouseEnter={() => {
                    if (isVisible) {
                      setHoverIndex(indexInGroup);
                    }
                  }}
                  onMouseLeave={() => setHoverIndex(null)}>
                  <CardItem
                    {...item}
                    active={isActive}
                    hovered={isHovered}
                    index={indexInGroup}
                    totalCards={cardsPerPage}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Indicators */}
        {maxIndex > 0 && (
          <div className="flex justify-center mt-6 sm:mt-8">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  aria-label={`ไปหน้า ${i + 1}`}
                  aria-current={slideIndex === i}
                  onClick={() => handleSlide(i)}
                  className="relative p-0.5 sm:p-1 group"
                  disabled={isTransitioning}>
                  <span
                    className={`
                      block transition-all duration-500 relative overflow-hidden
                      ${
                        slideIndex === i
                          ? "h-1.5 sm:h-2 w-6 sm:w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          : "h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-gray-300 group-hover:bg-gray-400"
                      }
                    `}>
                    {slideIndex === i && (
                      <span
                        className="absolute inset-0 bg-white/40"
                        style={{ animation: "shimmer 2s infinite" }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12">
        <button
          className="
          relative px-6 sm:px-8 lg:px-10 py-3 sm:py-4 font-bold text-sm sm:text-base text-white rounded-full
          bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600
          transform hover:scale-105 active:scale-95
          transition-all duration-500 ease-out
          shadow-lg hover:shadow-xl
          overflow-hidden group
        "
          style={{
            backgroundSize: "200% 100%",
            backgroundPosition: "0% 50%",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundPosition = "100% 50%")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundPosition = "0% 50%")
          }>
          <span className="relative z-10 flex items-center gap-2">
            ดูทั้งหมด
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </span>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-white/20" />
            <div
              className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-30 blur-2xl"
              style={{ animation: "pulse 2s infinite" }}
            />
          </div>
        </button>
      </div>
    </div>
  );
};

export default TabPage;
