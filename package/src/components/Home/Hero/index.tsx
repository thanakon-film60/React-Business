"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";

const Hero = () => {
  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden z-1 mt-[110px]"
      id="main-banner"
    >
      <video
        src="/images/video/banner-video.mp4"
        className="w-full h-full object-cover absolute top-0 left-0"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* ถ้ามี content ทับ video เพิ่ม absolute z-index ได้ */}
      <div className="relative z-10 w-full flex justify-center items-center">
        {/* Content ใส่ตรงนี้ */}
      </div>
    </section>
  );
};

export default Hero;
