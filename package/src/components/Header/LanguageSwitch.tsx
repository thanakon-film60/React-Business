"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SUPPORTED = ["th", "en"] as const;
type Locale = (typeof SUPPORTED)[number];

function normalize(path: string) {
  const p = path.startsWith("/") ? path : "/" + path;
  // ตัด / ท้ายสุดออก (ยกเว้น "/" อย่างเดียว)
  return p.replace(/\/+$/g, "") || "/";
}
function getLocale(path: string): Locale | null {
  const seg = path.split("/")[1];
  return (SUPPORTED as readonly string[]).includes(seg)
    ? (seg as Locale)
    : null;
}
function withLocale(path: string, locale: Locale) {
  const clean = normalize(path);
  const parts = clean.split("/");
  // ถ้ามี prefix locale อยู่แล้ว -> แทนที่
  if (SUPPORTED.includes(parts[1] as Locale)) {
    parts[1] = locale;
    const joined = parts.join("/");
    return joined || `/${locale}`;
  }
  // ถ้าไม่มี prefix locale -> เติมเข้าไป
  return `/${locale}${clean === "/" ? "" : clean}`;
}

export default function LanguageSwitch({
  className = "",
}: {
  className?: string;
}) {
  const pathname = usePathname() || "/";
  const current = getLocale(pathname);
  const thHref = withLocale(pathname, "th");
  const enHref = withLocale(pathname, "en");

  return (
    <div className={`flex gap-4 items-center ${className}`}>
      <Link
        href={enHref}
        aria-current={current === "en" ? "true" : undefined}
        className={`flex items-center gap-1 ${
          current === "en" ? "opacity-60 pointer-events-none" : ""
        }`}>
        <Image
          src="/images/icons/us.svg"
          width={20}
          height={14}
          alt="English"
        />
        <span className="text-xs">English</span>
      </Link>

      <Link
        href={thHref}
        aria-current={current === "th" ? "true" : undefined}
        className={`flex items-center gap-1 ${
          current === "th" ? "opacity-60 pointer-events-none" : ""
        }`}>
        <Image src="/images/icons/th.svg" width={20} height={14} alt="Thai" />
        <span className="text-xs">Thai</span>
      </Link>
    </div>
  );
}
