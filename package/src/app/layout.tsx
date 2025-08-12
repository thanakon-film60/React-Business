import "./globals.css";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Aoscompo from "@/utils/aos";
import { Metadata } from "next";
import "../Style/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../app/globals.css";
import DevMiniToolbar from "@/components/DevMiniToolbar";

import { LoadingProvider } from "@/components/LoadingContext";
import LoadingOverlay from "@/components/LoadingOverlay";
import NavProgress from "@/components/NavProgress";
import HomeBackground from "@/components/HomeBackground";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "THAI PACKAGING & PRINTING PCL",
  icons: { icon: "/TPP.ico" },
};

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
      <body
        className={`about-bg-image-background min-h-dvh overflow-x-hidden antialiased ${font.className}`}
      >
        <LoadingProvider>
          {/* ชิ้นส่วนที่แตะ URL/router หรือใช้งาน browser-only → ครอบด้วย Suspense */}
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
        </LoadingProvider>
      </body>
    </html>
  );
}
