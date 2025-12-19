import type { Metadata } from "next";
import "@/styles/expense.css";

export const metadata: Metadata = {
  title: "Expense Tracker | ระบบบันทึกรายรับรายจ่าย",
  description: "ระบบบันทึกรายรับรายจ่ายพร้อมอัพโหลดสลิป",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
