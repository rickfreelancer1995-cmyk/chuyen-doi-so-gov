import { CaseIcon } from "@sanity/icons/Case";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { defineField, defineType } from "sanity";
import { coverImageField, slugField } from "./shared";

/** Trang tĩnh: giới thiệu chung, chức năng nhiệm vụ, cơ cấu tổ chức... */
export const page = defineType({
  name: "page",
  title: "Trang giới thiệu",
  type: "document",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tiêu đề",
      type: "string",
      validation: (r) => r.required(),
    }),
    slugField(),
    defineField({
      name: "order",
      title: "Thứ tự trong menu Giới thiệu",
      type: "number",
    }),
    defineField({ name: "body", title: "Nội dung", type: "blockContent" }),
  ],
  orderings: [
    { title: "Thứ tự", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
});

export const service = defineType({
  name: "service",
  title: "Dịch vụ",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tên dịch vụ",
      type: "string",
      validation: (r) => r.required(),
    }),
    slugField(),
    defineField({
      name: "summary",
      title: "Mô tả ngắn",
      type: "text",
      rows: 3,
    }),
    coverImageField,
    defineField({ name: "body", title: "Chi tiết", type: "blockContent" }),
    defineField({ name: "order", title: "Thứ tự", type: "number" }),
  ],
  orderings: [
    { title: "Thứ tự", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
});
