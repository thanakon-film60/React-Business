import Link from "next/link";

/** ใช้ <picture> เพื่อ art direction: สลับไฟล์ภาพต่างกันตาม breakpoint */
type LogoProps = { className?: string; style?: React.CSSProperties };

export default function Logo({ className = "", style }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`} style={style}>
      <Link href="/" className="inline-block shrink-0" aria-label="Go home">
        <picture>
          {/* >=1600px ใช้โลโก้แนวนอน */}
          <source
            media="(min-width: 1600px)"
            srcSet="/images/logo/LOGO-TPP-SIDE.webp"
          />
          {/* <img> ด้านล่างคือ fallback สำหรับ <1600px> */}
          <img
            src="/images/logo/LOGO-name-2.webp"
            alt="THAI PACKAGING & PRINTING PCL"
            width={300}
            height={140}
            className="object-contain w-[300px] h-[140px]
                       [@media(min-width:1600px)]:w-[205px]
                       [@media(min-width:1600px)]:h-[185px]"
            loading="eager"
          />
        </picture>
      </Link>
    </div>
  );
}
