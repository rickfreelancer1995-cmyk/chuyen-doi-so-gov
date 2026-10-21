import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CardGrid } from "@/components/content-card";
import { Pagination } from "@/components/pagination";
import { Container, PageHeader, SkeletonList } from "@/components/ui";
import { param, parsePage } from "@/lib/format";
import { getCategories, getPosts } from "@/sanity/lib/data";

export const metadata: Metadata = { title: "Tin tức" };

export default function NewsPage({ searchParams }: PageProps<"/tin-tuc">) {
  return (
    <>
      <PageHeader title="Tin tức" description="Tin hoạt động, sự kiện về chuyển đổi số." crumbs={[{ label: "Tin tức" }]} />
      <Container className="py-10">
        <Suspense fallback={<SkeletonList />}>
          <NewsList searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function NewsList({ searchParams }: Pick<PageProps<"/tin-tuc">, "searchParams">) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const category = param(sp.chuyenmuc);
  const [categories, { items, total }] = await Promise.all([getCategories(), getPosts({ page, category })]);

  const tab = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium ${active ? "bg-brand-600 text-white" : "bg-surface text-ink hover:bg-brand-50"}`;

  return (
    <>
      {categories.length > 0 && (
        <nav aria-label="Chuyên mục" className="mb-8 flex flex-wrap gap-2">
          <Link href="/tin-tuc" className={tab(!category)}>
            Tất cả
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/tin-tuc?chuyenmuc=${c.slug}`} className={tab(category === c.slug)}>
              {c.title}
            </Link>
          ))}
        </nav>
      )}
      <CardGrid items={items} empty="Chưa có tin trong chuyên mục này." />
      <Pagination basePath="/tin-tuc" page={page} total={total} params={{ chuyenmuc: category }} />
    </>
  );
}
