import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
      {/* โลโก้ */}
      <Link href="/" className="inline-block flex-shrink-0 ">
        <Image
          src="/images/logo/logo.png"
          alt="Desgy Solutions"
          width={120}
          height={80}
          priority
          className="w-[120px] h-[80px] object-contain"
        />
      </Link>
    </div>
  );
};

export default Logo;
