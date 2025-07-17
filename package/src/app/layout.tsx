
import './globals.css'
import localFont from 'next/font/local'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
// import { ThemeProvider } from 'next-themes'
import ScrollToTop from '@/components/ScrollToTop'
import Aoscompo from '@/utils/aos'

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
      <body className={`${font.className}`}>
        <Aoscompo>
          <Header />
          {children}
          <Footer />
        </Aoscompo>
        <ScrollToTop />
      </body>
    </html>
  )
}
