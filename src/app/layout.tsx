import ScaledCanvas from "../components/ScaledCanvas";
// package/src/app/layout.tsx
import "./globals.css";
import localFont from "next/font/local";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Aoscompo from "@/utils/aos";
import "../Style/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../app/globals.css";
import DevMiniToolbar from "@/components/DevMiniToolbar";
import LoadingOverlay from "@/components/LoadingOverlay";
import NavProgress from "@/components/NavProgress";
import HomeBackground from "@/components/HomeBackground";
import { Suspense } from "react";
import Providers from "./providers";
// ====== SEO / Metadata ======
// Note: Next.js 15 App Router uses Metadata API instead of next-seo
export const metadata: Metadata = {
  metadataBase: new URL("https://www.tpp.co.th"),
  title: {
    default:
      "TPP | ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง | บรรจุภัณฑ์และงานพิมพ์คุณภาพ",
    template: "%s | TPP",
  },
  description:
    "TPP (Thai Packaging & Printing PCL) - บริษัท ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง จำกัด (มหาชน) ผู้นำด้านบรรจุภัณฑ์และงานพิมพ์ในประเทศไทย | บริการครบวงจร คุณภาพระดับโลก | กล่องลูกฟูก บรรจุภัณฑ์อ่อน งานพิมพ์ออฟเซ็ท",
  keywords: [
    "TPP",
    "Thai Packaging and Printing",
    "ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง",
    "TPPPCL",
    "บรรจุภัณฑ์",
    "งานพิมพ์",
    "Printing Solutions",
    "Packaging Thailand",
    "กล่องกระดาษ",
    "corrugated box",
    "กล่องลูกฟูก",
    "offset printing",
    "งานพิมพ์ออฟเซ็ท",
    "flexible packaging",
    "บรรจุภัณฑ์อ่อน",
    "label printing",
    "สติ๊กเกอร์",
    "packaging company thailand",
    "printing company thailand",
    "บริษัทบรรจุภัณฑ์",
    "บริษัทงานพิมพ์",
    "SET:TPP",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  icons: { icon: "/TPP.ico", apple: "/images/logo/LOGO-TPP-SIDE_9.png" },
  // เพิ่ม Open Graph ช่วยแชร์สวยและช่วย Search Engine
  openGraph: {
    type: "website",
    url: "https://www.tpp.co.th",
    siteName: "TPP - Thai Packaging & Printing",
    title: "TPP | ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง | บรรจุภัณฑ์และงานพิมพ์",
    description:
      "TPP (Thai Packaging & Printing PCL) - บริษัท ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง จำกัด (มหาชน) ผู้นำด้านบรรจุภัณฑ์และงานพิมพ์ในประเทศไทย",
    images: [
      {
        url: "https://www.tpp.co.th/images/logo/LOGO-TPP-SIDE_9.png",
        width: 1200,
        height: 630,
        alt: "TPP Logo - Thai Packaging & Printing",
      },
    ],
  },
  // เพิ่ม Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "TPP | ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง",
    description:
      "TPP - บริษัท ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง จำกัด (มหาชน) ผู้นำด้านบรรจุภัณฑ์และงานพิมพ์ในประเทศไทย",
    images: ["/images/logo/LOGO-TPP-SIDE_9.png"],
  },
};
// ====== Fonts ======
const font = localFont({
  src: [
    { path: "../../fonts/Kanit-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../fonts/Kanit-Bold.ttf", weight: "700", style: "normal" },
  ],
  display: "swap",
});
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content="flGnNhb1Ui0L9FS0V80ePdbJw7VeQWIuNXjtDV2R6nU"
        />
        {/* JSON-LD: Organization - ช่วยให้ Google เข้าใจข้อมูลบริษัท */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "TPP - Thai Packaging & Printing",
              legalName: "บริษัท ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง จำกัด (มหาชน)",
              alternateName: [
                "TPP",
                "TPPPCL",
                "Thai Packaging & Printing",
                "ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง",
              ],
              url: "https://www.tpp.co.th",
              logo: "https://www.tpp.co.th/images/logo/LOGO-TPP-SIDE_9.png",
              description:
                "TPP - บริษัท ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง จำกัด (มหาชน) ผู้นำด้านบรรจุภัณฑ์และงานพิมพ์ในประเทศไทย | Leading packaging & printing solutions provider in Thailand | SET:TPP",
              foundingDate: "1977",
              email: "ir@tpp.co.th",
              telephone: "+66-2-xxx-xxxx",
              address: {
                "@type": "PostalAddress",
                addressCountry: "TH",
                addressLocality: "Samut Prakan",
                addressRegion: "Samut Prakan",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "13.5990",
                longitude: "100.5998",
              },
              sameAs: [
                "https://www.facebook.com/tpppcl",
                "https://www.linkedin.com/company/thai-packaging-printing",
                "https://www.set.or.th/th/market/product/stock/quote/TPP/overview",
              ],
              knowsAbout: [
                "Packaging",
                "Printing",
                "Corrugated Box",
                "กล่องลูกฟูก",
                "Offset Printing",
                "งานพิมพ์ออฟเซ็ท",
                "Flexible Packaging",
                "บรรจุภัณฑ์อ่อน",
                "Label Printing",
                "สติ๊กเกอร์",
                "บรรจุภัณฑ์",
                "งานพิมพ์",
              ],
            }),
          }}
        />
        {/* JSON-LD: LocalBusiness - สำหรับการค้นหาในพื้นที่ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://www.tpp.co.th/#organization",
              name: "TPP - Thai Packaging & Printing",
              alternateName: "ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง",
              description:
                "บริษัท ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง จำกัด (มหาชน) ผู้นำด้านบรรจุภัณฑ์และงานพิมพ์ในประเทศไทย | SET:TPP",
              url: "https://www.tpp.co.th",
              image: "https://www.tpp.co.th/images/logo/LOGO-TPP-SIDE_9.png",
              priceRange: "$$",
              telephone: "+66-2-xxx-xxxx",
              email: "ir@tpp.co.th",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Samut Prakan",
                addressRegion: "Samut Prakan",
                addressCountry: "TH",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "13.5990",
                longitude: "100.5998",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "08:00",
                  closes: "17:00",
                },
              ],
              sameAs: [
                "https://www.facebook.com/tpppcl",
                "https://www.linkedin.com/company/thai-packaging-printing",
                "https://www.set.or.th/th/market/product/stock/quote/TPP/overview",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`about-bg-image-background min-h-dvh overflow-x-hidden antialiased ${font.className}`}
      >
        <Providers>
          <Suspense fallback={null}>
            <HomeBackground />
          </Suspense>
          <Suspense fallback={null}>
            <LoadingOverlay />
          </Suspense>
          <Suspense fallback={null}>
            <NavProgress minDuration={300} killMs={10000} />
          </Suspense>
          <Suspense fallback={null}>
            <Aoscompo>
              <div className="layout-grid">
                <Suspense fallback={null}>
                  <Header />
                </Suspense>
                <main className="flex-grow-1">
                  <Suspense fallback={null}>
                    <DevMiniToolbar
                      position="bottom-left"
                      storageKey="my_dev_toolbar"
                    />
                  </Suspense>
                  {children}
                </main>
                <Footer />
              </div>
            </Aoscompo>
          </Suspense>
          <Suspense fallback={null}>
            <ScrollToTop />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
