"use client";
import { usePathname } from 'next/navigation'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import Aoscompo from '@/utils/aos'
import ScrollToTop from '@/components/ScrollToTop'


export default function ClientLayout({ children }:{ children: React.ReactNode }) {
  const pathname = usePathname();
  // Next.js จะใช้ /not-found สำหรับหน้า 404 เสมอ
  if (pathname === "/not-found") {
    return <>{children}</>;
  }

  return (
    <Aoscompo>
      <Header />
      {children}
      <Footer />
      <ScrollToTop />
    </Aoscompo>
  );
}
