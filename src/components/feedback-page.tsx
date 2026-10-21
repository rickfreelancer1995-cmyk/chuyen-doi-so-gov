import type { ReactNode } from "react";
import { submitFeedback } from "@/lib/actions";
import { SubmissionForm, type FieldDef } from "./submission-form";
import { Container, PageHeader } from "./ui";

const baseFields: FieldDef[] = [
  { name: "fullName", label: "Họ và tên", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Số điện thoại", type: "tel" },
  { name: "organization", label: "Cơ quan, tổ chức, doanh nghiệp" },
];

/** Trang Góp ý và Hiến kế dùng chung form, khác nhau ở tiêu đề và gợi ý. */
export function FeedbackPage({
  kind,
  title,
  description,
  guide,
  titleLabel,
  contentLabel,
}: {
  kind: "gop-y" | "hien-ke";
  title: string;
  description: string;
  guide: ReactNode;
  titleLabel: string;
  contentLabel: string;
}) {
  const fields: FieldDef[] = [
    ...baseFields,
    { name: "title", label: titleLabel, required: true, full: true },
    { name: "content", label: contentLabel, type: "textarea", required: true, rows: 10 },
  ];
  return (
    <>
      <PageHeader title={title} description={description} crumbs={[{ label: title }]} />
      <Container className="grid gap-10 py-10 lg:grid-cols-3">
        <aside className="text-sm leading-relaxed text-muted lg:order-2">{guide}</aside>
        <section className="rounded-lg border border-line p-6 lg:col-span-2">
          <SubmissionForm
            action={submitFeedback}
            fields={fields}
            hidden={{ kind }}
            submitLabel={`Gửi ${title.toLowerCase()}`}
            successTitle="Gửi thành công"
            successMessage="Cảm ơn bạn đã đóng góp. Nội dung đã được chuyển tới bộ phận phụ trách để xem xét."
          />
        </section>
      </Container>
    </>
  );
}
