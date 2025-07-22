import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  style?: React.CSSProperties;
  // ไม่ต้องมี showTitleOnMobile แล้ว
};

const Logo: React.FC<LogoProps> = ({ className = "", style, }) => {
  return (
    <div className={`flex items-center ${className}`} style={style}>
      <Link href="/" className="inline-block flex-shrink-0 ">
        <Image
          src="/images/logo/logo.png"
          alt="Desgy Solutions"
          width={80}
          height={60}
          priority
          className="w-[120px] h-[80px] object-contain"
        />
      </Link>
      {/* แสดง h1 h2 เฉพาะ mobile */}
      <div className="d-xxl-none ">
        <h1 className="logo-title text-lg font-bold text-black" style={{fontSize: 16}}>
          THAI PACKAGING & PRINTING PCL
        </h1>
        <h2 className="logo-subtitle font-bold text-sm text-black " style={{fontSize: 14}}>
          บริษัท ไทยบรรจุภัณฑ์และการพิมพ์ จำกัด (มหาชน)
        </h2>
      </div>
    </div>
  );
};

export default Logo;
