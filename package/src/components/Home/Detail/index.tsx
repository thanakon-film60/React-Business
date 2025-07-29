"use client";
import React from "react";
import Image from "next/image";

const Dedicated = () => {
  return (
    <section className="relative bg-cover bg-center dark:bg-darkmode overflow-hidden">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md)">
              <h2 className="text-center text-2xl font-bold mb-8 underline decoration-red-500 decoration-8" style={{fontSize:"34px"}}>สินค้าและบริการของเรา</h2><br/>
        <div className="col-span-6 lg:col-span-3 flex justify-center gap-4">

          
          <div className="group relative w-[450px] h-[325px] mx-auto">
            <img
              src="/images/hero/Silk-screen-3.jpg"
              alt="static"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
            />
            <img
              src="/images/joinus/Silk-screen-V.gif"
              alt="animated"
              className="w-full h-full object-cover"
            />
            <p className="absolute bottom-0 left-0 m-2 text-white text-3xl font-extrabold drop-shadow-lg" style={{
                textShadow: `
                  2px 2px 6px rgba(0,0,0,0.8),
                  0px 0px 12px #fff,
                  0px 4px 16px rgba(0,0,0,0.8)
                `
              }}>
              การพัฒนาและการออกแบบ
            </p>

          </div>
            {/*  */}

           <div className="group relative w-[450px] h-[325px] mx-auto">
            <img
              src="/images/hero/Silk-screen-2.jpg"
              alt="static"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
            />
            <img
              src="/images/joinus/Silk-screen-V2.gif"
              alt="animated"
              className="w-full h-full object-cover"
            />
           <p className="absolute bottom-0 left-0 m-2 text-white text-3xl font-extrabold drop-shadow-lg" style={{
                textShadow: `
                  2px 2px 6px rgba(0,0,0,0.8),
                  0px 0px 12px #fff,
                  0px 4px 16px rgba(0,0,0,0.8)
                `
              }}>
              เตรียมพิมพ์และการพิมพ์
            </p>
          </div>
            {/*  */}
           <div className="group relative w-[450px] h-[325px] mx-auto">
            <img
              src="/images/hero/Silk-screen-1.jpg"
              alt="static"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
            />
            <img
              src="/images/joinus/Silk-screen-V3.gif"
              alt="animated"
              className="w-full h-full object-cover"
            />
            <p className="absolute bottom-0 left-0 m-2 text-white text-3xl font-extrabold drop-shadow-lg" style={{
                textShadow: `
                  2px 2px 6px rgba(0,0,0,0.8),
                  0px 0px 12px #fff,
                  0px 4px 16px rgba(0,0,0,0.8)
                `
              }}>
              ตัวอย่างสินค้า
            </p>
          </div>
            {/*  */}
         
              
          <div>
  
          </div>
        </div>
      </div>
    </section>
  );
};
export default Dedicated;
