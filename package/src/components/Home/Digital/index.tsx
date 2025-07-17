"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import NewsCarousel from "../../Carousel/NewsCarousel.jsx";
const Digital = () => {
  return (
    <section className="relative bg-cover bg-center dark:bg-darkmode overflow-hidden">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) rounded-3xl bg-primary bg-[url('/images/digital/bg.svg')] bg-no-repeat bg-right-top pb-60 relative">
        <div className="grid grid-cols-2 lg:grid-cols-2">
          {/* COLUMN-1 */}
         
            <div className="bg-gray-100 h-32 flex items-center justify-center rounded-lg">
             <NewsCarousel/>
            </div>

             <div className="bg-gray-100 h-32 flex items-center justify-center rounded-lg">
              We are a digital agency that builds amazing products.
            </div>
            <div className="bg-gray-100 h-32 flex items-center justify-center rounded-lg">
              GGGGGGGG
            </div>
            <div className="bg-gray-100 h-32 flex items-center justify-center rounded-lg">
              666666
            </div>
        </div>
        <div className="absolute -bottom-16 -right-20">
          {/* ว่าง */}
        </div>
      </div>
    </section>
  );
};
export default Digital;
