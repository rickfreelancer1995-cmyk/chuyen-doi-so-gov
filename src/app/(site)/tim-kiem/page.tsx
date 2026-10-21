import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import { Badge, Container, EmptyState, PageHeader } from "@/components/ui";
import { formatDate, param } from "@/lib/format";
import { hrefFor, typeLabels } from "@/lib/routes";
import { search } from "@/sanity/lib/data";

export const metadata: Metadata = { title: "Tìm kiếm", robots: { index: false } };

export default function SearchPage({ searchParams }: PageProps<"/tim-kiem">) {
  return (
    <>
      <PageHeader title="Tìm kiếm" crumbs={[{ label: "Tìm kiếm" }]} />
      <Container className="max-w-4xl py-10">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-surface" />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function Results({ searchParams }: Pick<PageProps<"/tim-kiem">, "searchParams">) {
  const q = param((await searchParams).q).slice(0, 100);
  const hits = await search(q);

  return (
    <>
      <Form action="/tim-kiem" className="mb-8 flex" role="search">
        <label htmlFor="q" className="sr-only">
          Từ khóa
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Nhập từ khóa có dấu, ví dụ: chữ ký số"
          className="min-w-0 flex-1 rounded-l-md border border-r-0 border-line px-4 py-3 outline-none focus:border-brand-500"
        />
        <button type="submit" className="rounded-r-md bg-brand-600 px-6 font-medium text-white hover:bg-brand-700">
          Tìm
        </button>
      </Form>

      {!q ? (
        <EmptyState message="Nhập từ khóa để tìm tin tức, văn bản, tài liệu." />
      ) : hits.length === 0 ? (
        <EmptyState message={`Không có kết quả cho "${q}". Thử từ khóa khác hoặc gõ đầy đủ dấu tiếng Việt.`} />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted">
            {hits.length} kết quả cho “{q}”
          </p>
          <ul className="divide-y divide-line">
            {hits.map((h) => (
              <li key={h._id} className="py-4">
                <div className="mb-1 flex items-center gap-2 text-xs text-muted">
                  <Badge>{typeLabels[h._type] ?? h._type}</Badge>
                  {h.publishedAt && <time dateTime={h.publishedAt}>{formatDate(h.publishedAt)}</time>}
                </div>
                <Link href={hrefFor(h)} className="font-semibold hover:text-brand-600">
                  {h.code ? `${h.code}: ${h.title}` : h.title}
                </Link>
                {h.excerpt && <p className="mt-1 line-clamp-2 text-sm text-muted">{h.excerpt}</p>}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
