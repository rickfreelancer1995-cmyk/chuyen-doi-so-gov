import Link from "next/link";
import { PAGE_SIZE } from "@/sanity/lib/data";

/** Phân trang qua ?page=, giữ nguyên các bộ lọc khác trên URL. */
export function Pagination({
  basePath,
  page,
  total,
  params = {},
}: {
  basePath: string;
  page: number;
  total: number;
  params?: Record<string, string>;
}) {
  const pageCount = Math.ceil(total / PAGE_SIZE);
  if (pageCount <= 1) return null;

  const href = (p: number) => {
    const search = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
    if (p > 1) search.set("page", String(p));
    const qs = search.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  // Hiện tối đa 5 số trang quanh trang hiện tại
  const start = Math.max(1, Math.min(page - 2, pageCount - 4));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, i) => start + i);

  const base = "flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm";
  return (
    <nav aria-label="Phân trang" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={href(page - 1)} className={`${base} border-line hover:bg-surface`}>
          ‹ Trước
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page ? "page" : undefined}
          className={`${base} ${p === page ? "border-brand-600 bg-brand-600 text-white" : "border-line hover:bg-surface"}`}
        >
          {p}
        </Link>
      ))}
      {page < pageCount && (
        <Link href={href(page + 1)} className={`${base} border-line hover:bg-surface`}>
          Sau ›
        </Link>
      )}
    </nav>
  );
}
