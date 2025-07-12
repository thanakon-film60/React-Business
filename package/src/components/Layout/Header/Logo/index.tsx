import Image from "next/image";
import Link from "next/link";
import "../../../../Style/style.css";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-4 ">
      {" "}
      {/* flex row + เว้นช่อง */}
      <Link href="/" className="inline-block">
        <Image
          src="/images/logo/logo.png"
          alt="Desgy Solutions"
          width={60}
          height={40}
          priority
        />
      </Link>
      <div>
        <h1 className="logo-title text-lg font-semibold text-white">
          THAI PACKAGING & PRINTING PCL
        </h1>
        <h2 className="logo-subtitle text-sm text-gray-600 text-white">
          บริษัท ไทยบรรจุภัณฑ์และการพิมพ์ จำกัด (มหาชน)
        </h2>
      </div>
    </div>
  );
};

export default Logo;
