import type { Metadata } from "next";
import { Suspense } from "react";
import { CompactList } from "@/components/content-card";
import { Pagination } from "@/components/pagination";
import { Container, PageHeader, SkeletonList } from "@/components/ui";
import { parsePage } from "@/lib/format";
import { getAnnouncements } from "@/sanity/lib/data";

export const metadata: Metadata = { title: "Thông báo" };

export default function AnnouncementsPage({ searchParams }: PageProps<"/thong-bao">) {
  return (
    <>
      <PageHeader title="Thông báo" crumbs={[{ label: "Thông báo" }]} />
      <Container className="max-w-4xl py-10">
        <Suspense fallback={<SkeletonList rows={3} />}>
          <List searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function List({ searchParams }: Pick<PageProps<"/thong-bao">, "searchParams">) {
  const page = parsePage((await searchParams).page);
  const { items, total } = await getAnnouncements({ page });
  return (
    <>
      <CompactList items={items} empty="Chưa có thông báo." />
      <Pagination basePath="/thong-bao" page={page} total={total} />
    </>
  );
}
