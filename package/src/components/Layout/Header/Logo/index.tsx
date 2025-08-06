// Logo.tsx
import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  style?: React.CSSProperties;
  variant?: "side" | "horizontal";
};

const Logo: React.FC<LogoProps> = ({
  className = "",
  style,
  variant = "side",
}) => {
  const logoSrc =
    variant === "horizontal"
      ? "/images/logo/LOGO-name 2.png"
      : "/images/logo/LOGO TPP SIDE.png";

  // ความสูงความกว้างปรับตามโลโก้แต่ละอัน (ถ้าจำเป็น)
  const logoSize =
    variant === "horizontal"
      ? { width: 180, height: 42 }
      : { width: 205, height: 185 };

  return (
    <div className={`flex items-center ${className}`} style={style}>
      <Link href="/" className="inline-block flex-shrink-0">
        <Image
          src={logoSrc}
          alt="THAI PACKAGING & PRINTING LOGO"
          width={logoSize.width}
          height={logoSize.height}
          priority
          className="object-contain"
        />
      </Link>
    </div>
  );
};

export default Logo;
