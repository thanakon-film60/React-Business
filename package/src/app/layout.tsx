import './globals.css'
import localFont from 'next/font/local'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
// import { ThemeProvider } from 'next-themes'
import ScrollToTop from '@/components/ScrollToTop'
import Aoscompo from '@/utils/aos'
import { Metadata } from 'next'    
import '../Style/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../app/globals.css';

export const metadata: Metadata = {
  title: "THAI PACKAGING & PRINTING PCL",
  icons: {
    icon: '/TPP.ico',
  },
}

const font = localFont({
  src: [
    {
      path: '../../fonts/Kanit-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/Kanit-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`about-bg-image-background ${font.className}`}>
        <Aoscompo>
          <div className="layout-grid">
            <Header />
            {/* main content */}
            <main className="flex-grow-1">
              {children}
            </main>
            <Footer />
          </div>
        </Aoscompo>
        <ScrollToTop />
      </body>
    </html>
  )
}
