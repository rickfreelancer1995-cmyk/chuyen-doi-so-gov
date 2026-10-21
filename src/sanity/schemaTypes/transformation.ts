import { BookIcon } from "@sanity/icons/Book";
import { BulbOutlineIcon } from "@sanity/icons/BulbOutline";
import { ChartUpwardIcon } from "@sanity/icons/ChartUpward";
import { LinkIcon } from "@sanity/icons/Link";
import { StarIcon } from "@sanity/icons/Star";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
  adminLevels,
  audiences,
  indicatorGroups,
  knowledgeFormats,
  knowledgeTopics,
  pillars,
  sectors,
} from "../options";
import {
  attachmentsField,
  coverImageField,
  multiSelectField,
  publishedAtField,
  selectField,
  slugField,
} from "./shared";

export const story = defineType({
  name: "story",
  title: "Câu chuyện chuyển đổi số",
  type: "document",
  icon: StarIcon,
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
      name: "locality",
      title: "Địa phương / đơn vị",
      description: "Nơi triển khai mô hình.",
      type: "string",
    }),
    selectField("pillar", "Trụ cột", pillars),
    selectField("sector", "Lĩnh vực", sectors),
    defineField({ name: "excerpt", title: "Tóm tắt", type: "text", rows: 3 }),
    coverImageField,
    defineField({ name: "body", title: "Nội dung", type: "blockContent" }),
  ],
  orderings: [
    {
      title: "Mới nhất",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: { select: { title: "title", subtitle: "locality", media: "coverImage" } },
});

export const problem = defineType({
  name: "problem",
  title: "Bài toán chuyển đổi số",
  type: "document",
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tên bài toán",
      type: "string",
      validation: (r) => r.required(),
    }),
    slugField(),
    publishedAtField,
    defineField({
      name: "summary",
      title: "Mô tả ngắn",
      type: "text",
      rows: 3,
    }),
    coverImageField,
    selectField("pillar", "Trụ cột", pillars),
    selectField("sector", "Lĩnh vực", sectors),
    multiSelectField("audiences", "Đối tượng hưởng lợi", audiences),
    selectField("adminLevel", "Cấp hành chính", adminLevels),
    defineField({
      name: "proposer",
      title: "Đơn vị đặt bài toán",
      type: "string",
    }),
    defineField({ name: "body", title: "Chi tiết bài toán", type: "blockContent" }),
    attachmentsField,
  ],
  preview: { select: { title: "title", subtitle: "proposer", media: "coverImage" } },
});

export const knowledge = defineType({
  name: "knowledge",
  title: "Tri thức",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tiêu đề",
      type: "string",
      validation: (r) => r.required(),
    }),
    slugField(),
    publishedAtField,
    selectField("topic", "Chủ đề", knowledgeTopics, true),
    selectField("format", "Dạng tài liệu", knowledgeFormats),
    defineField({ name: "excerpt", title: "Tóm tắt", type: "text", rows: 3 }),
    coverImageField,
    defineField({
      name: "videoUrl",
      title: "Link video (YouTube)",
      type: "url",
      hidden: ({ document }) => document?.format !== "video",
    }),
    defineField({ name: "body", title: "Nội dung", type: "blockContent" }),
    attachmentsField,
  ],
  preview: { select: { title: "title", subtitle: "topic", media: "coverImage" } },
});

export const indicator = defineType({
  name: "indicator",
  title: "Chỉ số / số liệu",
  type: "document",
  icon: ChartUpwardIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tên chỉ số",
      type: "string",
      validation: (r) => r.required(),
    }),
    selectField("group", "Nhóm", indicatorGroups, true),
    defineField({
      name: "unit",
      title: "Đơn vị tính",
      description: "Ví dụ: %, hồ sơ, doanh nghiệp. Để trống nếu là số đếm.",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Giải thích",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "target",
      title: "Chỉ tiêu",
      type: "object",
      fields: [
        defineField({ name: "value", title: "Giá trị", type: "number" }),
        defineField({ name: "year", title: "Năm", type: "number" }),
      ],
    }),
    defineField({
      name: "series",
      title: "Số liệu theo năm",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "dataPoint",
          fields: [
            defineField({
              name: "year",
              title: "Năm",
              type: "number",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "value",
              title: "Giá trị",
              type: "number",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { year: "year", value: "value" },
            prepare: ({ year, value }) => ({ title: `${year}: ${value}` }),
          },
        }),
      ],
    }),
    defineField({ name: "source", title: "Nguồn số liệu", type: "string" }),
    defineField({ name: "order", title: "Thứ tự", type: "number" }),
    defineField({
      name: "highlight",
      title: "Hiện trên trang chủ",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    { title: "Thứ tự", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
});

export const toolLink = defineType({
  name: "toolLink",
  title: "Nền tảng, công cụ hỗ trợ",
  type: "document",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tên",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", title: "Mô tả", type: "text", rows: 2 }),
    defineField({
      name: "url",
      title: "Đường dẫn",
      type: "url",
      validation: (r) => r.required(),
    }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({ name: "order", title: "Thứ tự", type: "number" }),
  ],
  orderings: [
    { title: "Thứ tự", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "url", media: "logo" } },
});
