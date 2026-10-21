import type { Metadata } from "next";
import { Suspense } from "react";
import { FilterForm } from "@/components/filter-form";
import { LegalDocTable } from "@/components/legal-doc-table";
import { Pagination } from "@/components/pagination";
import { Container, PageHeader } from "@/components/ui";
import { formatNumber, param, parsePage } from "@/lib/format";
import { getLegalDocs, getLegalDocYears } from "@/sanity/lib/data";
import { legalDocFields, legalDocTypes } from "@/sanity/options";

export const metadata: Metadata = {
  title: "Văn bản",
  description: "Văn bản quy phạm pháp luật, văn bản chỉ đạo điều hành về chuyển đổi số.",
};

export default function LegalDocsPage({ searchParams }: PageProps<"/van-ban">) {
  return (
    <>
      <PageHeader
        title="Văn bản"
        description="Văn bản quy phạm pháp luật, văn bản chỉ đạo điều hành về chuyển đổi số."
        crumbs={[{ label: "Văn bản" }]}
      />
      <Container className="py-10">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-surface" />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function Results({ searchParams }: Pick<PageProps<"/van-ban">, "searchParams">) {
  const sp = await searchParams;
  const filter = {
    page: parsePage(sp.page),
    q: param(sp.q),
    docType: param(sp.loai),
    field: param(sp.linhvuc),
    year: param(sp.nam),
  };
  const [years, { items, total }] = await Promise.all([getLegalDocYears(), getLegalDocs(filter)]);

  return (
    <>
      <FilterForm
        action="/van-ban"
        fields={[
          { kind: "text", name: "q", label: "Từ khóa", placeholder: "Số ký hiệu, trích yếu...", value: filter.q },
          { kind: "select", name: "loai", label: "Loại văn bản", options: legalDocTypes, value: filter.docType },
          { kind: "select", name: "linhvuc", label: "Lĩnh vực", options: legalDocFields, value: filter.field },
          { kind: "select", name: "nam", label: "Năm ban hành", options: years.map((y) => ({ title: y, value: y })), value: filter.year },
        ]}
      />
      <p className="mb-3 text-sm text-muted">Tìm thấy {formatNumber(total)} văn bản</p>
      <LegalDocTable items={items} />
      <Pagination
        basePath="/van-ban"
        page={filter.page}
        total={total}
        params={{ q: filter.q, loai: filter.docType, linhvuc: filter.field, nam: filter.year }}
      />
    </>
  );
}
