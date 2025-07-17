"use client";
import React from "react";
import Image from "next/image";

const Dedicated = () => {
  return (
    <section className="relative bg-cover bg-center dark:bg-darkmode overflow-hidden">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md)">
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
