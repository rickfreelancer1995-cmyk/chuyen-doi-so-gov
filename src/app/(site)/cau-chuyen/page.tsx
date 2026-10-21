import type { Metadata } from "next";
import { Suspense } from "react";
import { CardGrid } from "@/components/content-card";
import { Pagination } from "@/components/pagination";
import { Container, PageHeader, SkeletonList } from "@/components/ui";
import { parsePage } from "@/lib/format";
import { getStories } from "@/sanity/lib/data";

export const metadata: Metadata = {
  title: "Câu chuyện chuyển đổi số",
  description: "Mô hình, cách làm hay về chuyển đổi số tại các địa phương, đơn vị.",
};

export default function StoriesPage({ searchParams }: PageProps<"/cau-chuyen">) {
  return (
    <>
      <PageHeader
        title="Câu chuyện chuyển đổi số"
        description="Mô hình, cách làm hay về chuyển đổi số tại các địa phương, đơn vị."
        crumbs={[{ label: "Câu chuyện chuyển đổi số" }]}
      />
      <Container className="py-10">
        <Suspense fallback={<SkeletonList />}>
          <List searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function List({ searchParams }: Pick<PageProps<"/cau-chuyen">, "searchParams">) {
  const page = parsePage((await searchParams).page);
  const { items, total } = await getStories({ page });
  return (
    <>
      <CardGrid items={items} empty="Chưa có câu chuyện." />
      <Pagination basePath="/cau-chuyen" page={page} total={total} />
    </>
  );
}
