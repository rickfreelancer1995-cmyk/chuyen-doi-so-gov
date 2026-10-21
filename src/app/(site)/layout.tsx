import { DemoToast } from "@/components/demo";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { isDemoMode } from "@/sanity/env";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2"
      >
        Bỏ qua đến nội dung chính
      </a>
      {isDemoMode && (
        <div className="bg-amber-400 px-4 py-1.5 text-center text-xs font-medium text-amber-950 sm:text-sm">
          Bản demo: nội dung là dữ liệu minh họa, chưa kết nối hệ thống quản trị.
        </div>
      )}
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      {isDemoMode && <DemoToast />}
    </>
  );
}
