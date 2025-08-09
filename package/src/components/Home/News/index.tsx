import React, { useState } from "react";
import CardItem from "./CardItem";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "animate.css";

const CARDS_PER_PAGE = 4;
const CARD_WIDTH = 320;

const TabPage = () => {
  const newsData = [
    {
      date: "15 สิงหาคม 2567",
      title:
        "ซ้อมดับเพลิงประจำปี เพื่อเสริมสร้างความพร้อมรับมือเหตุฉุกเฉินอย่างมีประสิทธิภาพ สร้างจิตสำนึกด้านความปลอดภัย และความร่วมมือในการป้องกันอัคคีภัยในสถานที่ทำงาน",
      image: "/images/New/Annual_Fire_Drill.png",
    },
    {
      date: "23 พฤษภาคม 2568",
      title:
        "ทำบุญประจำปี 2568 เนื่องในโอกาสก้าวเข้าสู่ปีที่ 37 แห่งการดำเนินธุรกิจ  ได้จัดกิจกรรมทำบุญประจำปี ณ บริเวณโรงอาหาร เพื่อเสริมสิริมงคลแก่คณะผู้บริหารและพนักงาน 23 พฤษภาคม 2568",
      image: "/images/New/Company_Merit-Making_Ceremony.png",
    },
    {
      date: "1 กรกฎาคม 2568",
      title:
        "กิจกรรมสวัสดิการ “แจกสิ่งของอุปโภคบริโภค” ประจำไตรมาส 2/2568   TPP จัดกิจกรรมมอบสิ่งของอุปโภคบริโภคให้แก่พนักงาน เพื่อส่งเสริมสวัสดิการ สร้างขวัญและกำลังใจ วันที่ 1 กรกฎาคม 2568",
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
      title:
        "xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxx",
      image: "/images/New/Dev_Size.png",
    },
    {
      date: "03 เมษายน 2568",
      title:
        "xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxx",
      image: "/images/New/Dev_Size.png",
    },
    {
      date: "03 เมษายน 2568",
      title:
        "xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxx",
      image: "/images/New/Dev_Size.png",
    },
    {
      date: "03 เมษายน 2568",
      title:
        "xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxx",
      image: "/images/New/Dev_Size.png",
    },
  ];

  const articleData = [
    {
      date: "13 มิถุนายน 2568",
      title:
        "xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxx",
      image: "/images/New/Dev_Size.png",
    },
    {
      date: "06 มิถุนายน 2568",
      title:
        "xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxx",
      image: "/images/New/Dev_Size.png",
    },
    {
      date: "30 พฤษภาคม 2568",
      title:
        "xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxx",
      image: "/images/New/Dev_Size.png",
    },
    {
      date: "23 พฤษภาคม 2568",
      title:
        "xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxx",
      image: "/images/New/Dev_Size.png",
    },
    {
      date: "23 พฤษภาคม 2568",
      title:
        "xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxx",
      image: "/images/New/Dev_Size.png",
    },
  ];

  const [activeTab, setActiveTab] = useState<"news" | "article">("news");
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const data = activeTab === "news" ? newsData : articleData;
  const maxIndex = Math.max(0, data.length - CARDS_PER_PAGE);

  // ทุกครั้งที่เปลี่ยน slide/page หรือ tab ให้ active ใบแรก
  React.useEffect(() => {
    setActiveIndex(0);
  }, [slideIndex, activeTab]);

  // ---------------------------------------------------------------------------------------------------------------

  React.useEffect(() => {
    if (paused || maxIndex === 0) return;
    const id = setInterval(() => {
      setDirection("right"); // << เพิ่มบรรทัดนี้
      setSlideIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 3000);
    return () => clearInterval(id);
  }, [paused, maxIndex]);

  return (
    <div className="w-full px-2 md:px-4 max-w-6xl mx-auto relative">
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6 mt-2">
        <button
          className={`px-6 py-2 font-bold text-lg ${
            activeTab === "news"
              ? "border-b-4 border-red-600 text-red-600"
              : "text-gray-500"
          }`}
          onClick={() => {
            setActiveTab("news");
            setDirection("right");
            setSlideIndex(0);
            setActiveIndex(0);
          }}>
          ข่าวสารและกิจกรรม
        </button>
        <button
          className={`px-6 py-2 font-bold text-lg ${
            activeTab === "article"
              ? "border-b-4 border-red-600 text-red-600"
              : "text-gray-500"
          }`}
          onClick={() => {
            setActiveTab("article");
            setSlideIndex(0);
            setActiveIndex(0);
          }}>
          บทความ
        </button>
      </div>
      <div
        className="relative flex items-center justify-center min-h-[400px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}>
        {/* Left Arrow */}

        <button
          className="absolute -left-2 md:-left-7 top-1/2 -translate-y-1/2 z-10 bg-white/80 text-blue-600 hover:bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full shadow-lg border border-blue-200 disabled:opacity-40 transition"
          style={{ left: "-12rem" }}
          onClick={() => {
            setDirection("left");
            setSlideIndex((i) => Math.max(0, i - 1));
          }}
          disabled={slideIndex === 0}>
          <FaChevronLeft size={30} />
        </button>
        <div className="flex gap-7 w-full justify-center transition-all duration-500">
          {data
            .slice(slideIndex, slideIndex + CARDS_PER_PAGE)
            .map((item, idx) => {
              const isActive = activeIndex === idx;
              const isHovered = hoverIndex === idx;
              return (
                <div
                  key={slideIndex + idx}
                  className="transition-all duration-300"
                  style={{
                    width: CARD_WIDTH,
                    minWidth: CARD_WIDTH,
                    maxWidth: "95vw",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setHoverIndex(idx)}
                  onMouseLeave={() => setHoverIndex(null)}>
                  <CardItem
                    {...item}
                    active={isActive}
                    hovered={isHovered && !isActive}
                    direction={direction}
                  />
                </div>
              );
            })}
        </div>
        {/* Right Arrow */}
        <button
          className="absolute -right-2 md:-right-7 top-1/2 -translate-y-1/2 z-10 bg-white/80 text-blue-600 hover:bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full shadow-lg border border-blue-200 disabled:opacity-40 transition"
          style={{ left: "80rem" }}
          onClick={() => {
            setDirection("right");
            setSlideIndex((i) => Math.min(maxIndex, i + 1));
          }}
          disabled={slideIndex === maxIndex}>
          <FaChevronRight size={30} />
        </button>
      </div>
      {/* Dots */}
      {/* Dots */}
      <div className="mt-6 w-full py-3">
        <div className="flex justify-center items-center gap-3">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              aria-label={`ไปหน้า ${i + 1}`}
              aria-current={slideIndex === i}
              onClick={() => {
                setDirection(i > slideIndex ? "right" : "left");
                setSlideIndex(i);
              }}
              className="p-1">
              <span
                className={
                  slideIndex === i
                    ? // จุด active = วงแหวนขาว กลางโปร่ง ให้เห็นพื้นหลังเข้ม
                      "block w-2.5 h-2.5 rounded-full bg-transparent ring-2 ring-white ring-offset-2 ring-offset-[#2b3040] transition"
                    : // จุดปกติ = เทาๆ
                      "block w-2.5 h-2.5 rounded-full bg-gray-400/70 transition"
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button className="ir-btn ir-btn-glow">ดูทั้งหมด</button>
      </div>
      <br />
    </div>
  );
};

export default TabPage;
