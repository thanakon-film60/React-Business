"use client";
import React, { useState } from "react";
import CardItem from "./CardItem"; 
import Image from "next/image";

const newsData = [
  {
    date: "06 พฤษภาคม 2568",
    title: 'ขอเชิญเข้าร่วมงาน "งานประมูลรถบรรทุกมือสอง" ไปรษณีย์ไทย ประจำเดือนพฤษภาคม',
    image: "/images/insta/new1.jpg",
  },
  {
    date: "06 พฤษภาคม 2568",
    title: "ไปรษณีย์ฯ ประกาศกำไร!!! โตสวนหุ้นฯ 478.9 ล้านบาท ตามที่คาด",
    image: "/images/insta/new2.jpg",
  },
  {
    date: "17 เมษายน 2568",
    title: "บมจ.ไปรษณีย์ฯ ร่วมสนับสนุนประเพณีสงกรานต์ วัดกิจกรรมบรรเทาภัย กลางผู้บริหาร และผู้บริหารบริษัทในเครือ",
    image: "/images/insta/new3.jpg",
  },
  {
    date: "03 เมษายน 2568",
    title: 'ขอเชิญเข้าร่วมงาน "งานประมูลรถบรรทุกมือสอง" ไปรษณีย์ไทย ประจำเดือนเมษายน',
    image: "/images/insta/new4.jpg",
  },
    {
    date: "03 เมษายน 2568",
    title: 'ขอเชิญเข้าร่วมงาน "งานประมูลรถบรรทุกมือสอง" ไปรษณีย์ไทย ประจำเดือนเมษายน',
    image: "/images/insta/new5.jpg",
  },
    {
    date: "03 เมษายน 2568",
    title: 'ขอเชิญเข้าร่วมงาน "งานประมูลรถบรรทุกมือสอง" ไปรษณีย์ไทย ประจำเดือนเมษายน',
    image: "/images/insta/new6.jpg",
  },
];

const articleData = [
  {
    date: "13 มิถุนายน 2568",
    title: "ต่อใบขับขี่หมดอายุ ในปีนี้ หาคำตอบ ใช้เอกสารอะไรบ้าง?",
    image: "/images/insta/article1.jpg",
  },
  {
    date: "06 มิถุนายน 2568",
    title: "เช็กให้ชัวร์! 7 จุดอันตรายที่รถบรรทุกต้องระวังช่วงหน้าฝน",
    image: "/images/insta/article2.jpg",
  },
  {
    date: "30 พฤษภาคม 2568",
    title: 'ทำไม "รถบรรทุก" ต้องติดแผ่นสะท้อนแสงหน้า-ด้านหลัง',
    image: "/images/insta/article3.jpg",
  },
  {
    date: "23 พฤษภาคม 2568",
    title: "5 วิธีเช็คสติ๊กเกอร์ฝ้ากระจกรถช่วงหน้าฝน",
    image: "/images/insta/article4.jpg",
  },
    {
    date: "23 พฤษภาคม 2568",
    title: "5 วิธีเช็คสติ๊กเกอร์ฝ้ากระจกรถช่วงหน้าฝน",
    image: "/images/insta/article5.jpg",
  },
    {
    date: "23 พฤษภาคม 2568",
    title: "5 วิธีเช็คสติ๊กเกอร์ฝ้ากระจกรถช่วงหน้าฝน",
    image: "/images/insta/article6.jpg",
  },
];

const TabPage = () => {
  const [activeTab, setActiveTab] = useState<"news" | "article">("news");
  const [page, setPage] = useState(0);

  const data = activeTab === "news" ? newsData : articleData;
  const perPage = 4;
  const pageCount = Math.ceil(data.length / perPage);
  const pageData = data.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="w-full px-4 relative">
      <h4 className="text-center font-bold pb-4 underline decoration-red-500 decoration-8 " style={{ fontSize: "34px"}}>
          ข่าวสารและบทความ
      </h4>
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-6 py-2 font-bold text-lg ${
            activeTab === "news"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => {
            setActiveTab("news");
            setPage(0);
          }}
        >
          ข่าวสารและกิจกรรม
        </button>
        <button
          className={`px-6 py-2 font-bold text-lg ${
            activeTab === "article"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => {
            setActiveTab("article");
            setPage(0);
          }}
        >
          บทความ
        </button>
      </div>

      {/* Content */}
      <div className="relative">
        {/* Left Arrow */}
        {page > 0 && (
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#eaf1fc] text-gray-700 hover:text-black w-10 h-10 flex items-center justify-center rounded-full shadow"
            onClick={() => setPage(page - 1)}
          >
            <span className="text-2xl">&lt;</span>
          </button>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pageData.map((item, idx) => (
            <CardItem key={idx} {...item} />
          ))}
        </div>

        {/* Right Arrow */}
        {page < pageCount - 1 && (
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#eaf1fc] text-gray-700 hover:text-black w-10 h-10 flex items-center justify-center rounded-full shadow"
            onClick={() => setPage(page + 1)}
          >
            <span className="text-2xl">&gt;</span>
          </button>
        )}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 mx-1 rounded-full ${
              page === i ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() => setPage(i)}
          />
        ))}
      </div>

      {/* View All Button */}
      {/* {activeTab === "article" && ( */}
        <div className="flex justify-center mt-6">
          <button className="px-8 py-2 bg-yellow-400 rounded-full shadow font-bold hover:bg-yellow-500 transition">
            ดูทั้งหมด
          </button>
        </div>
        <br/>
      {/* )} */}
    </div>
  );
};

export default TabPage;
