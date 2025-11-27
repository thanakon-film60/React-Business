import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// Supported locales
const locales = ["th", "en"];
const defaultLocale = "th";

// Public paths ที่ไม่ต้อง login (จากรายการ API-all-log)
const publicPaths = [
  // หน้าหลักและข้อมูลบริษัท
  "/",
  "/about-philosophy",
  "/about-history",
  "/about-executives",
  "/about-subsidiaries",
  // ผลิตภัณฑ์และบริการ
  "/our-services",
  "/our-customers",
  "/products-pakku-packaging",
  // โรงงานและคุณภาพ
  "/factory-technology",
  "/quality-control",
  "/quality-certification",
  // นักลงทุนสัมพันธ์
  "/investor-stock-price",
  "/investor-financials",
  "/investor-governance",
  "/investor-shareholders",
  "/investor-downloads",
  "/investor-contact",
  // ข่าวสารและกิจกรรม
  "/news-events",
  "/articles",
  "/tpp-news",
  "/awards-achievements",
  // การตลาดและโฆษณา
  "/facebook-ads-dashboard",
  "/facebook-ads-insights",
  "/facebook-ads-manager",
  "/google-ads-dashboard",
  // การจัดการลูกค้า
  "/contact-dashboard",
  "/customer-contact-dashboard",
  "/contact-inquiry",
  // อื่นๆ
  "/careers",
  "/go-green",
  "/PDPA",
  "/login",
  "/register",
  "/forgot-password",
  "/oauth2callback",
  // Fullscreen Pages
  "/customer-all-data",
  "/edit-customer",
  "/performance-surgery-schedule",
];

// Protected paths ที่ต้อง login (เฉพาะบางหน้า)
const protectedPaths = [
  "/home",
  "/crm-advanced",
  "/customer-folder-manager",
  "/all-files-gallery",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Check authentication for protected routes
  const token = request.cookies.get("authToken")?.value;

  // Check if it's a static/system path
  const isStaticPath =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/downloads") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname === "/TPP.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.includes(".");

  // If accessing static files, allow through
  if (isStaticPath) {
    return NextResponse.next();
  }

  // Check if it's a public path (ไม่ต้อง login)
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Check if it's a protected path (ต้อง login)
  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Auth pages (login, register, forgot-password)
  const isAuthPage = ["/login", "/register", "/forgot-password"].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If accessing protected path without token, redirect to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and trying to access auth pages, redirect to home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/home", request.url));
  }
  // ตรวจสอบว่า URL มี locale prefix หรือไม่
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) {
    // ถ้ามี locale prefix (เช่น /th/contact-inquiry)
    // ให้ rewrite ไปยัง path จริงโดยไม่มี locale prefix
    const locale = pathname.split("/")[1];
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    // Rewrite URL
    const url = request.nextUrl.clone();
    url.pathname = pathWithoutLocale;
    // เก็บ locale ไว้ใน header
    const response = NextResponse.rewrite(url);
    response.headers.set("x-locale", locale);
    return response;
  }
  // ถ้าไม่มี locale prefix ให้ทำงานปกติ
  return NextResponse.next();
}
export const config = {
  // กำหนด path ที่ต้องการให้ middleware ทำงาน
  matcher: [
    // ไม่รวม static files และ API routes
    "/((?!api|_next/static|_next/image|favicon.ico|images|downloads|TPP.ico).*)",
  ],
};
