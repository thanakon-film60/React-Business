"use client";
import React from "react";
import Image from "next/image";

const Dedicated = () => {
  return (
    <section className="relative bg-cover bg-center dark:bg-darkmode overflow-hidden">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md)">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* <Image
            src="/images/dedicated/spiral.svg"
            height={272}
            width={686}
            alt="spiral-design"
            className="absolute left-0 top-0 hidden lg:block -z-10"
          /> */}
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-6">
            <Image
              src="/images/dedicated/man.svg"
              alt="man-icon"
              width={416}
              height={530}
              className="mx-auto md:mx-0"
            />
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-6">
  
          </div>
        </div>
      </div>
    </section>
  );
};
export default Dedicated;
