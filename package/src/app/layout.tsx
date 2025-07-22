// app/layout.tsx
import './globals.css'
import localFont from 'next/font/local'
import ClientLayout from './ClientLayout'

export const metadata = {
  title: "THAI PACKAGING & PRINTING PCL",
  icons: { icon: '/TPP.ico' },
}

const font = localFont({
  src: [
    { path: '../../fonts/Kanit-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../fonts/Kanit-Bold.ttf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
