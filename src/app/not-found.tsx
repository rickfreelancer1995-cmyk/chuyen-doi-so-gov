import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink">Không tìm thấy trang</h1>
      <p className="mt-2 text-muted">Trang bạn tìm có thể đã bị gỡ hoặc đổi đường dẫn.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="rounded-md bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700">
          Về trang chủ
        </Link>
        <Link href="/tim-kiem" className="rounded-md border border-line px-5 py-2.5 font-medium hover:bg-surface">
          Tìm kiếm
        </Link>
      </div>
    </main>
  );
}
