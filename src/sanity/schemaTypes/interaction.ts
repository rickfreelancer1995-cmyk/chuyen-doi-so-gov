import { CommentIcon } from "@sanity/icons/Comment";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { defineField, defineType } from "sanity";
import { feedbackKinds, feedbackStatuses, questionStatuses } from "../options";
import { selectField } from "./shared";

// Hai loại tài liệu này do người dân gửi qua form ngoài site (Server Action),
// cán bộ vào Studio để trả lời / xử lý.

const submitterFields = [
  defineField({ name: "fullName", title: "Họ tên", type: "string", readOnly: true }),
  defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
  defineField({ name: "phone", title: "Số điện thoại", type: "string", readOnly: true }),
  defineField({ name: "address", title: "Địa chỉ", type: "string", readOnly: true }),
  defineField({
    name: "submittedAt",
    title: "Thời điểm gửi",
    type: "datetime",
    readOnly: true,
  }),
];

export const question = defineType({
  name: "question",
  title: "Hỏi đáp",
  type: "document",
  icon: HelpCircleIcon,
  groups: [
    { name: "answer", title: "Trả lời", default: true },
    { name: "submitter", title: "Người hỏi" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Tiêu đề câu hỏi",
      type: "string",
      group: "answer",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "content",
      title: "Nội dung câu hỏi",
      type: "text",
      rows: 6,
      group: "answer",
    }),
    {
      ...selectField("status", "Trạng thái", questionStatuses, true),
      group: "answer",
      initialValue: "pending",
    },
    defineField({
      name: "answer",
      title: "Nội dung trả lời",
      type: "blockContent",
      group: "answer",
    }),
    defineField({
      name: "answeredBy",
      title: "Đơn vị trả lời",
      type: "string",
      group: "answer",
    }),
    defineField({
      name: "answeredAt",
      title: "Ngày trả lời",
      type: "datetime",
      group: "answer",
    }),
    defineField({
      name: "isPublic",
      title: "Công khai trên site",
      description: "Chỉ hiện câu hỏi đã trả lời và được bật công khai. Thông tin người hỏi không bao giờ hiện ra ngoài.",
      type: "boolean",
      group: "answer",
      initialValue: false,
    }),
    ...submitterFields.map((f) => ({ ...f, group: "submitter" })),
  ],
  orderings: [
    {
      title: "Mới gửi",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", status: "status", name: "fullName" },
    prepare: ({ title, status, name }) => ({
      title,
      subtitle: `${questionStatuses.find((s) => s.value === status)?.title ?? ""} · ${name ?? ""}`,
    }),
  },
});

export const feedback = defineType({
  name: "feedback",
  title: "Góp ý, hiến kế",
  type: "document",
  icon: CommentIcon,
  fields: [
    { ...selectField("kind", "Loại", feedbackKinds, true), readOnly: true },
    defineField({ name: "title", title: "Tiêu đề", type: "string", readOnly: true }),
    defineField({
      name: "content",
      title: "Nội dung",
      type: "text",
      rows: 8,
      readOnly: true,
    }),
    defineField({
      name: "organization",
      title: "Cơ quan / tổ chức",
      type: "string",
      readOnly: true,
    }),
    ...submitterFields,
    {
      ...selectField("status", "Trạng thái xử lý", feedbackStatuses, true),
      initialValue: "new",
    },
    defineField({
      name: "note",
      title: "Ghi chú nội bộ",
      type: "text",
      rows: 4,
    }),
  ],
  orderings: [
    {
      title: "Mới gửi",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", kind: "kind", status: "status" },
    prepare: ({ title, kind, status }) => ({
      title,
      subtitle: `${feedbackKinds.find((k) => k.value === kind)?.title ?? ""} · ${
        feedbackStatuses.find((s) => s.value === status)?.title ?? ""
      }`,
    }),
  },
});
