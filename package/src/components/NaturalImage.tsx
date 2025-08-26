"use client";

import Image from "next/image";
import clsx from "clsx";

type NaturalImageProps = {
  src: string;
  width: number; // ความกว้างจริงของไฟล์
  height: number; // ความสูงจริงของไฟล์
  alt?: string;
  className?: string;
  bleed?: boolean; // true = ให้ภาพพาดเต็มขอบหน้าจอ (full-bleed)
};

export default function NaturalImage({
  src,
  width,
  height,
  alt = "",
  className,
  bleed = false,
}: NaturalImageProps) {
  return (
    <div className={clsx(bleed ? "w-screen" : "w-full")}>
      {/* ตัวครอบที่ “ห้าม” กว้างเกินขนาดจริงของรูป */}
      <div className={clsx("mx-auto", "max-w-[2048px]")}>
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          // ทำให้ย่อ-ขยายแบบรักษาอัตราส่วนและไม่ถูกครอป
          className={clsx("block w-full h-auto", className)}
          // ช่วย optimizer เลือกไฟล์ย่อยตามความกว้างหน้าจอ
          sizes={bleed ? "100vw" : "(min-width:1024px) 1024px, 100vw"}
          priority
        />
      </div>
    </div>
  );
}
