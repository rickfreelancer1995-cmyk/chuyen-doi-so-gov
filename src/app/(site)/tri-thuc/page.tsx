import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CardGrid } from "@/components/content-card";
import { Pagination } from "@/components/pagination";
import { Container, PageHeader, SkeletonList } from "@/components/ui";
import { param, parsePage } from "@/lib/format";
import { getKnowledgeList } from "@/sanity/lib/data";
import { knowledgeFormats, knowledgeTopics, optionTitle } from "@/sanity/options";

export const metadata: Metadata = {
  title: "Tri thức",
  description: "Cẩm nang, tài liệu, báo cáo và kiến thức về chuyển đổi số.",
};

export default function KnowledgePage({ searchParams }: PageProps<"/tri-thuc">) {
  return (
    <>
      <PageHeader
        title="Tri thức chuyển đổi số"
        description="Cẩm nang, tài liệu hướng dẫn, báo cáo và kiến thức về chuyển đổi số."
        crumbs={[{ label: "Tri thức" }]}
      />
      <Container className="grid gap-10 py-10 lg:grid-cols-4">
        <Suspense fallback={<SkeletonList />}>
          <Content searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function Content({ searchParams }: Pick<PageProps<"/tri-thuc">, "searchParams">) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const topic = param(sp.chude);
  const { items, total } = await getKnowledgeList({ page, topic });

  const link = (active: boolean) =>
    `block rounded-md px-3 py-2 text-sm ${active ? "bg-brand-600 font-semibold text-white" : "hover:bg-surface"}`;

  return (
    <>
      <nav aria-label="Chủ đề" className="lg:col-span-1">
        <h2 className="mb-3 font-bold uppercase text-brand-800">Chủ đề</h2>
        <ul className="space-y-1">
          <li>
            <Link href="/tri-thuc" className={link(!topic)}>
              Tất cả
            </Link>
          </li>
          {knowledgeTopics.map((t) => (
            <li key={t.value}>
              <Link href={`/tri-thuc?chude=${t.value}`} className={link(topic === t.value)}>
                {t.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="lg:col-span-3">
        <CardGrid
          items={items.map((i) => ({ ...i, label: optionTitle(knowledgeFormats, i.format) || undefined }))}
          empty="Chưa có tài liệu trong chủ đề này."
        />
        <Pagination basePath="/tri-thuc" page={page} total={total} params={{ chude: topic }} />
      </div>
    </>
  );
}
