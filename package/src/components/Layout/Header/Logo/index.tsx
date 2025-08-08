import { useMediaQuery } from 'react-responsive';
import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  style?: React.CSSProperties;
};

const Logo: React.FC<LogoProps> = ({ className = "", style }) => {
  // Bootstrap xl: 1200px
  const isDesktop = useMediaQuery({ minWidth: 1200 });
  const isMobileOrTablet = useMediaQuery({ maxWidth: 1199 });

  return (
    <div className={`flex items-center ${className}`} style={style}>
      <Link href="/" className="inline-block flex-shrink-0">
        {isDesktop && (
          <Image
            src="/images/logo/LOGO TPP SIDE.png"
            alt="Desgy Solutions"
            width={205}
            height={185}
            priority
            className="w-[205px] h-[185px] object-contain"
          />
        )}
        {isMobileOrTablet && (
          <Image
            src="/images/logo/LOGO-name-TPP.png"
            alt="Desgy Solutions"
            width={205}
            height={185}
            priority
            className="w-[300px] h-[140px] object-contain"
          />
        )}
      </Link>
    </div>
  );
};

export default Logo;
