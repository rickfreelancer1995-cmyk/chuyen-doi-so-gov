import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { isDemoMode } from "@/sanity/env";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Cổng thông tin Chuyển đổi số",
    template: "%s | Cổng thông tin Chuyển đổi số",
  },
  description:
    "Tin tức, văn bản, tri thức và số liệu về chuyển đổi số; kênh hỏi đáp, góp ý của người dân và doanh nghiệp.",
  // Bản demo chứa dữ liệu minh họa, không cho lập chỉ mục
  ...(isDemoMode ? { robots: { index: false, follow: false } } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${beVietnam.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
