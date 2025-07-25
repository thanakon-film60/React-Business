"use client";
import React, { useState } from "react";

const newsData = [
  {
    date: "06 พฤษภาคม 2568",
    title: 'ขอเชิญเข้าร่วมงาน "งานประมูลรถบรรทุกมือสอง" ไปรษณีย์ไทย ประจำเดือนพฤษภาคม',
    image: "/images/news1.jpg",
  },
  {
    date: "06 พฤษภาคม 2568",
    title: "ไปรษณีย์ฯ ประกาศกำไร!!! โตสวนหุ้นฯ 478.9 ล้านบาท ตามที่คาด",
    image: "/images/news2.jpg",
  },
  {
    date: "17 เมษายน 2568",
    title: "บมจ.ไปรษณีย์ฯ ร่วมสนับสนุนประเพณีสงกรานต์ วัดกิจกรรมบรรเทาภัย กลางผู้บริหาร และผู้บริหารบริษัทในเครือ",
    image: "/images/news3.jpg",
  },
  {
    date: "03 เมษายน 2568",
    title: 'ขอเชิญเข้าร่วมงาน "งานประมูลรถบรรทุกมือสอง" ไปรษณีย์ไทย ประจำเดือนเมษายน',
    image: "/images/news4.jpg",
  },
];

const articleData = [
  {
    date: "13 มิถุนายน 2568",
    title: "ต่อใบขับขี่หมดอายุ ในปีนี้ หาคำตอบ ใช้เอกสารอะไรบ้าง?",
    image: "/images/article1.jpg",
  },
  {
    date: "06 มิถุนายน 2568",
    title: "เช็กให้ชัวร์! 7 จุดอันตรายที่รถบรรทุกต้องระวังช่วงหน้าฝน",
    image: "/images/article2.jpg",
  },
  {
    date: "30 พฤษภาคม 2568",
    title: 'ทำไม "รถบรรทุก" ต้องติดแผ่นสะท้อนแสงหน้า-ด้านหลัง',
    image: "/images/article3.jpg",
  },
  {
    date: "23 พฤษภาคม 2568",
    title: "5 วิธีเช็คสติ๊กเกอร์ฝ้ากระจกรถช่วงหน้าฝน",
    image: "/images/article4.jpg",
  },
];

const TabPage = () => {
  const [activeTab, setActiveTab] = useState("news");
  const [page, setPage] = useState(0);

  // เปลี่ยนตรงนี้ถ้าอยากให้ pagination/slide จริง
  const data = activeTab === "news" ? newsData : articleData;
  const perPage = 4; // จำนวนที่แสดงต่อ 1 หน้า

  // Pagination logic (เอา pagination จริง, slide จริง ค่อยเพิ่ม)
  const pageCount = Math.ceil(data.length / perPage);
  const pageData = data.slice(page * perPage, page * perPage + perPage);

  return (
  
    <div className="max-w-6xl mx-auto bg-white border rounded-lg shadow p-6">
      {/* Tabs */}
      <div className="flex justify-center border-b mb-4">
        <button
          className={`px-6 py-2 font-bold ${activeTab === "news" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500"}`}
          onClick={() => { setActiveTab("news"); setPage(0); }}
        >
          ข่าวสารและกิจกรรม
        </button>
        <button
          className={`px-6 py-2 font-bold ${activeTab === "article" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500"}`}
          onClick={() => { setActiveTab("article"); setPage(0); }}
        >
          บทความ
        </button>
      </div>

      {/* Card list & arrows */}
      <div className="relative">
        {/* Left arrow */}
        {page > 0 && (
          <button
            className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 z-10 bg-gray-100 rounded-full shadow p-2"
            onClick={() => setPage(page - 1)}
          >
            &#8592;
          </button>
        )}
        {/* Card list */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {pageData.map((item, idx) => (
            <div key={idx} className="bg-blue-50 rounded-lg p-3 flex flex-col shadow group hover:shadow-lg transition">
              <div className="relative pb-[56%] mb-2 rounded-lg overflow-hidden">
                {/* Demo: ใช้สีพื้นแทนรูปจริง */}
                <div className="absolute inset-0 bg-blue-200 flex items-center justify-center text-4xl text-white font-bold">
                  <img src={item.image} alt="" className="object-cover w-full h-full" />
                </div>
              </div>
              <span className="text-xs text-gray-500 mb-1">{item.date}</span>
              <span className="font-bold text-base mb-3 line-clamp-3">{item.title}</span>
              <div className="flex-grow" />
              <button className="self-end mt-2 bg-yellow-400 hover:bg-yellow-500 rounded-full p-2 transition">
                <span className="material-icons">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
        {/* Right arrow */}
        {page < pageCount - 1 && (
          <button
            className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 z-10 bg-gray-100 rounded-full shadow p-2"
            onClick={() => setPage(page + 1)}
          >
            &#8594;
          </button>
        )}
      </div>
      {/* Pagination dots */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 mx-1 rounded-full ${page === i ? "bg-blue-600" : "bg-gray-300"}`}
            onClick={() => setPage(i)}
          />
        ))}
      </div>
      {/* "ดูทั้งหมด" เฉพาะ tab บทความ */}
      {activeTab === "article" && (
        <div className="flex justify-center mt-5">
          <button className="px-8 py-2 bg-yellow-400 rounded-full shadow font-bold hover:bg-yellow-500 transition">
            ดูทั้งหมด
          </button>
        </div>
      )}
    </div>
    
  );
  
};

export default TabPage;
