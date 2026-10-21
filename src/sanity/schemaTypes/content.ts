import { BellIcon } from "@sanity/icons/Bell";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { ImagesIcon } from "@sanity/icons/Images";
import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";
import { legalDocFields, legalDocStatuses, legalDocTypes } from "../options";
import {
  attachmentsField,
  coverImageField,
  publishedAtField,
  selectField,
  slugField,
} from "./shared";

export const category = defineType({
  name: "category",
  title: "Chuyên mục tin",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tên chuyên mục",
      type: "string",
      validation: (r) => r.required(),
    }),
    slugField(),
    defineField({ name: "description", title: "Mô tả", type: "text", rows: 2 }),
    defineField({ name: "order", title: "Thứ tự", type: "number" }),
  ],
  orderings: [
    { title: "Thứ tự", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
});

export const post = defineType({
  name: "post",
  title: "Tin tức",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tiêu đề",
      type: "string",
      validation: (r) => r.required().max(200),
    }),
    slugField(),
    defineField({
      name: "category",
      title: "Chuyên mục",
      type: "reference",
      to: [{ type: "category" }],
    }),
    publishedAtField,
    defineField({
      name: "featured",
      title: "Tin nổi bật",
      description: "Hiện ở khối tin nổi bật trên trang chủ.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "excerpt",
      title: "Tóm tắt",
      type: "text",
      rows: 3,
      validation: (r) => r.max(400),
    }),
    coverImageField,
    defineField({ name: "body", title: "Nội dung", type: "blockContent" }),
    attachmentsField,
    defineField({ name: "source", title: "Nguồn", type: "string" }),
  ],
  orderings: [
    {
      title: "Mới nhất",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category.title", media: "coverImage" },
  },
});

export const announcement = defineType({
  name: "announcement",
  title: "Thông báo",
  type: "document",
  icon: BellIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tiêu đề",
      type: "string",
      validation: (r) => r.required(),
    }),
    slugField(),
    publishedAtField,
    defineField({
      name: "important",
      title: "Thông báo quan trọng",
      description: "Ghim lên đầu danh sách.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "excerpt", title: "Tóm tắt", type: "text", rows: 3 }),
    defineField({ name: "body", title: "Nội dung", type: "blockContent" }),
    attachmentsField,
  ],
  orderings: [
    {
      title: "Mới nhất",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});

export const legalDocument = defineType({
  name: "legalDocument",
  title: "Văn bản",
  type: "document",
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: "code",
      title: "Số ký hiệu",
      description: "Ví dụ: 749/QĐ-TTg",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Trích yếu",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    selectField("docType", "Loại văn bản", legalDocTypes, true),
    selectField("field", "Lĩnh vực", legalDocFields),
    defineField({ name: "issuer", title: "Cơ quan ban hành", type: "string" }),
    defineField({ name: "signer", title: "Người ký", type: "string" }),
    defineField({
      name: "issuedAt",
      title: "Ngày ban hành",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "effectiveAt",
      title: "Ngày hiệu lực",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
    }),
    selectField("status", "Tình trạng hiệu lực", legalDocStatuses),
    defineField({ name: "file", title: "Tệp văn bản", type: "file" }),
    defineField({
      name: "externalUrl",
      title: "Link văn bản gốc",
      description: "Dùng khi không tải tệp lên, ví dụ link Cơ sở dữ liệu quốc gia về văn bản pháp luật.",
      type: "url",
    }),
  ],
  orderings: [
    {
      title: "Ngày ban hành mới nhất",
      name: "issuedAtDesc",
      by: [{ field: "issuedAt", direction: "desc" }],
    },
  ],
  preview: { select: { title: "code", subtitle: "title" } },
});

export const banner = defineType({
  name: "banner",
  title: "Banner trang chủ",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tiêu đề",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "subtitle", title: "Mô tả ngắn", type: "text", rows: 2 }),
    defineField({
      name: "image",
      title: "Ảnh nền",
      description: "Khuyến nghị 1920×640.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "ctaLabel", title: "Chữ trên nút", type: "string" }),
    defineField({
      name: "ctaUrl",
      title: "Link của nút",
      description: "Đường dẫn trong site (/tin-tuc) hoặc link ngoài (https://...).",
      type: "string",
    }),
    defineField({ name: "order", title: "Thứ tự", type: "number" }),
    defineField({
      name: "active",
      title: "Đang hiển thị",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    { title: "Thứ tự", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "subtitle", media: "image" } },
});
