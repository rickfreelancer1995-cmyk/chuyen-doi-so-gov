import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FilterForm } from "@/components/filter-form";
import { Pagination } from "@/components/pagination";
import { Badge, Container, EmptyState, PageHeader, SkeletonList } from "@/components/ui";
import { formatNumber, param, parsePage } from "@/lib/format";
import { getProblems } from "@/sanity/lib/data";
import { adminLevels, audiences, optionTitle, pillars, sectors } from "@/sanity/options";

export const metadata: Metadata = {
  title: "Bài toán chuyển đổi số",
  description: "Các bài toán chuyển đổi số đang cần giải pháp, phân loại theo trụ cột, lĩnh vực, đối tượng.",
};

export default function ProblemsPage({ searchParams }: PageProps<"/bai-toan">) {
  return (
    <>
      <PageHeader
        title="Bài toán chuyển đổi số"
        description="Các bài toán đang cần giải pháp. Doanh nghiệp, tổ chức có thể nghiên cứu và đề xuất cách giải."
        crumbs={[{ label: "Bài toán chuyển đổi số" }]}
      />
      <Container className="py-10">
        <Suspense fallback={<SkeletonList />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function Results({ searchParams }: Pick<PageProps<"/bai-toan">, "searchParams">) {
  const sp = await searchParams;
  const filter = {
    page: parsePage(sp.page),
    pillar: param(sp.trucot),
    sector: param(sp.linhvuc),
    audience: param(sp.doituong),
    adminLevel: param(sp.cap),
  };
  const { items, total } = await getProblems(filter);

  return (
    <>
      <FilterForm
        action="/bai-toan"
        fields={[
          { kind: "select", name: "trucot", label: "Trụ cột", options: pillars, value: filter.pillar },
          { kind: "select", name: "linhvuc", label: "Lĩnh vực", options: sectors, value: filter.sector },
          { kind: "select", name: "doituong", label: "Đối tượng", options: audiences, value: filter.audience },
          { kind: "select", name: "cap", label: "Cấp hành chính", options: adminLevels, value: filter.adminLevel },
        ]}
      />
      <p className="mb-4 text-sm text-muted">{formatNumber(total)} bài toán</p>
      {items.length === 0 ? (
        <EmptyState message="Không có bài toán phù hợp bộ lọc." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((p) => (
            <article key={p._id} className="rounded-lg border border-line p-5 transition hover:border-brand-200 hover:shadow-md">
              <div className="flex flex-wrap gap-2">
                {p.pillar && <Badge>{optionTitle(pillars, p.pillar)}</Badge>}
                {p.sector && <Badge tone="gray">{optionTitle(sectors, p.sector)}</Badge>}
                {p.adminLevel && <Badge tone="gray">{optionTitle(adminLevels, p.adminLevel)}</Badge>}
              </div>
              <h2 className="mt-3 text-lg font-semibold leading-snug">
                <Link href={`/bai-toan/${p.slug}`} className="hover:text-brand-600">
                  {p.title}
                </Link>
              </h2>
              {p.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted">{p.excerpt}</p>}
              {p.proposer && <p className="mt-3 text-xs text-muted">Đơn vị đặt bài toán: {p.proposer}</p>}
            </article>
          ))}
        </div>
      )}
      <Pagination
        basePath="/bai-toan"
        page={filter.page}
        total={total}
        params={{ trucot: filter.pillar, linhvuc: filter.sector, doituong: filter.audience, cap: filter.adminLevel }}
      />
    </>
  );
}
