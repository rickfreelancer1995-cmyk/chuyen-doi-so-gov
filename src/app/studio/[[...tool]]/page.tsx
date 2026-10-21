import Link from "next/link";
import { NextStudio } from "next-sanity/studio";
import { isSanityConfigured } from "@/sanity/env";
import config from "../../../../sanity.config";

// Studio chạy hoàn toàn phía client; trang này không đọc params nên được prerender tĩnh.
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="flex flex-1 items-center justify-center bg-surface px-4 py-24">
        <div className="w-full max-w-lg rounded-xl border border-line bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">Bản demo</p>
          <h1 className="mt-2 text-2xl font-bold text-brand-800">Trang quản trị chưa được thiết lập</h1>
          <p className="mt-3 text-muted">
            Site đang chạy bằng dữ liệu minh họa. Để quản trị nội dung thật, tạo project Sanity rồi điền{" "}
            <code className="rounded bg-surface px-1 py-0.5 text-sm">NEXT_PUBLIC_SANITY_PROJECT_ID</code> vào biến môi trường
            (xem README).
          </p>
          <Link href="/" className="mt-6 inline-block rounded-md bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700">
            ← Về trang chủ
          </Link>
        </div>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
