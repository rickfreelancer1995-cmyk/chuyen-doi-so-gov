import type { Metadata } from "next";
import { Suspense } from "react";
import { FilterForm } from "@/components/filter-form";
import { Pagination } from "@/components/pagination";
import { PortableBody } from "@/components/portable-body";
import { SubmissionForm, type FieldDef } from "@/components/submission-form";
import { Container, EmptyState, PageHeader } from "@/components/ui";
import { submitQuestion } from "@/lib/actions";
import { formatDate, formatNumber, param, parsePage } from "@/lib/format";
import { getPublicQuestions } from "@/sanity/lib/data";

export const metadata: Metadata = {
  title: "Hỏi đáp",
  description: "Gửi câu hỏi về chuyển đổi số và xem câu trả lời của cơ quan chức năng.",
};

const fields: FieldDef[] = [
  { name: "fullName", label: "Họ và tên", required: true },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "Câu trả lời sẽ gửi về email này" },
  { name: "phone", label: "Số điện thoại", type: "tel" },
  { name: "address", label: "Địa chỉ" },
  { name: "title", label: "Tiêu đề câu hỏi", required: true, full: true },
  { name: "content", label: "Nội dung câu hỏi", type: "textarea", required: true, rows: 7 },
];

export default function QuestionsPage({ searchParams }: PageProps<"/hoi-dap">) {
  return (
    <>
      <PageHeader
        title="Hỏi đáp"
        description="Câu hỏi của người dân, doanh nghiệp về chuyển đổi số và câu trả lời của cơ quan chức năng."
        crumbs={[{ label: "Hỏi đáp" }]}
      />
      <Container className="grid gap-12 py-10 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <h2 className="mb-4 text-xl font-bold text-brand-800">Câu hỏi đã được trả lời</h2>
          <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-surface" />}>
            <AnsweredList searchParams={searchParams} />
          </Suspense>
        </section>
        <section id="gui-cau-hoi" className="scroll-mt-6 lg:col-span-2">
          <div className="rounded-lg border border-line p-6 lg:sticky lg:top-6">
            <h2 className="text-xl font-bold text-brand-800">Gửi câu hỏi</h2>
            <p className="mb-5 mt-1 text-sm text-muted">
              Câu hỏi được cán bộ tiếp nhận, trả lời qua email và có thể được công khai (ẩn thông tin người hỏi).
            </p>
            <SubmissionForm
              action={submitQuestion}
              fields={fields}
              submitLabel="Gửi câu hỏi"
              successTitle="Đã gửi câu hỏi"
              successMessage="Cảm ơn bạn. Câu hỏi đã được tiếp nhận, câu trả lời sẽ được gửi về email của bạn."
            />
          </div>
        </section>
      </Container>
    </>
  );
}

async function AnsweredList({ searchParams }: Pick<PageProps<"/hoi-dap">, "searchParams">) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const q = param(sp.q);
  const { items, total } = await getPublicQuestions({ page, q });

  return (
    <>
      <FilterForm action="/hoi-dap" fields={[{ kind: "text", name: "q", label: "Tìm câu hỏi", placeholder: "Nhập từ khóa...", value: q }]} />
      {q && <p className="mb-3 text-sm text-muted">{formatNumber(total)} kết quả</p>}
      {items.length === 0 ? (
        <EmptyState message={q ? "Không tìm thấy câu hỏi phù hợp." : "Chưa có câu hỏi được công khai."} />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item._id}>
              <details className="group rounded-lg border border-line open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-start gap-3 p-4 hover:bg-surface">
                  <span aria-hidden className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    H
                  </span>
                  <span className="flex-1">
                    <span className="font-semibold">{item.title}</span>
                    <span className="mt-1 block text-xs text-muted">Gửi ngày {formatDate(item.submittedAt)}</span>
                  </span>
                  <span aria-hidden className="text-muted transition group-open:rotate-180">▾</span>
                </summary>
                <div className="space-y-4 border-t border-line p-4">
                  {item.content && <p className="whitespace-pre-line text-sm text-muted">{item.content}</p>}
                  <div className="rounded-md bg-brand-50 p-4">
                    <p className="mb-2 text-sm font-semibold text-brand-700">
                      Trả lời{item.answeredBy ? ` của ${item.answeredBy}` : ""}
                      {item.answeredAt ? ` (${formatDate(item.answeredAt)})` : ""}:
                    </p>
                    <PortableBody value={item.answer} />
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
      <Pagination basePath="/hoi-dap" page={page} total={total} params={{ q }} />
    </>
  );
}
