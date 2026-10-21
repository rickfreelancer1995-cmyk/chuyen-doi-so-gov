import { defineArrayMember, defineField, defineType } from "sanity";
import type { Option } from "../options";

/** Nội dung bài viết: đoạn văn, tiêu đề, danh sách, ảnh có chú thích. */
export const blockContent = defineType({
  name: "blockContent",
  title: "Nội dung",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Đoạn văn", value: "normal" },
        { title: "Tiêu đề 2", value: "h2" },
        { title: "Tiêu đề 3", value: "h3" },
        { title: "Trích dẫn", value: "blockquote" },
      ],
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Mô tả ảnh", type: "string" }),
        defineField({ name: "caption", title: "Chú thích", type: "string" }),
      ],
    }),
  ],
});

/** File đính kèm (PDF, Word...) hiển thị cuối bài. */
export const attachment = defineType({
  name: "attachment",
  title: "Tệp đính kèm",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Tên hiển thị", type: "string" }),
    defineField({
      name: "file",
      title: "Tệp",
      type: "file",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "file.asset.originalFilename" } },
});

export const slugField = (source = "title") =>
  defineField({
    name: "slug",
    title: "Đường dẫn (slug)",
    type: "slug",
    options: { source, maxLength: 120, slugify: vnSlugify },
    validation: (r) => r.required(),
  });

export const coverImageField = defineField({
  name: "coverImage",
  title: "Ảnh đại diện",
  type: "image",
  options: { hotspot: true },
  fields: [defineField({ name: "alt", title: "Mô tả ảnh", type: "string" })],
});

export const publishedAtField = defineField({
  name: "publishedAt",
  title: "Ngày đăng",
  type: "datetime",
  initialValue: () => new Date().toISOString(),
  validation: (r) => r.required(),
});

export const attachmentsField = defineField({
  name: "attachments",
  title: "Tệp đính kèm",
  type: "array",
  of: [defineArrayMember({ type: "attachment" })],
});

export function selectField(
  name: string,
  title: string,
  list: Option[],
  required = false,
) {
  return defineField({
    name,
    title,
    type: "string",
    options: { list, layout: list.length <= 4 ? "radio" : "dropdown" },
    validation: required ? (r) => r.required() : undefined,
  });
}

export function multiSelectField(name: string, title: string, list: Option[]) {
  return defineField({
    name,
    title,
    type: "array",
    of: [defineArrayMember({ type: "string" })],
    options: { list, layout: "grid" },
  });
}

/** Slug tiếng Việt: bỏ dấu, đ -> d. */
export function vnSlugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}
