import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  style?: React.CSSProperties;
};

const Logo: React.FC<LogoProps> = ({ className = "", style }) => {
  return (
    <div className={`flex items-center gap-3 sm:gap-4 md:gap-6 ${className}`} style={style}>
      {/* โลโก้ */}
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
    </div>
  );
};

export default Logo;
