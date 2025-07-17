"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import NewsCarousel from "../../Carousel/NewsCarousel.jsx";
import InvestorInfoGrid from "@/components/InvestorInfo/InvestorInfoGrid";

const Digital = () => {
  return (
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) bg-primary  bg-no-repeat bg-right-top pb-60 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 items-stretch min-h-[350px]">
            <div className="bg-gray-100 flex flex-col items-center justify-center rounded-lg h-full">
             <NewsCarousel/>
            </div>
             <div className="bg-gray-100 flex flex-col items-center justify-center rounded-lg h-full">
              <InvestorInfoGrid />
            </div>
            <div className="bg-gray-100 flex flex-col items-center justify-center rounded-lg h-full">
              GGGGG GG  G 
            </div>
            <div className="bg-gray-100 flex flex-col items-center justify-center rounded-lg h-full">
              6666  6  6
            </div>
        </div>
        <div className="absolute -bottom-16 -right-20">
          {/* ว่าง */}
        </div>
      </div>
    
  );
};
export default Digital;
