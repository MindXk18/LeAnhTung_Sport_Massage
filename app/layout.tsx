import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/shared/LayoutShell";

export const metadata: Metadata = {
  title: "Sport Massage — Đặt lịch trị liệu & Bài tập phục hồi",
  description:
    "Dịch vụ trị liệu chấn thương thể thao, massage giải cơ sâu và thư viện bài tập tự phục hồi tại nhà dành cho vận động viên.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className="font-sans bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
