import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Cấu hình chung",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "Chung", default: true },
    { name: "contact", title: "Liên hệ" },
    { name: "footer", title: "Chân trang" },
  ],
  fields: [
    defineField({
      name: "siteName",
      title: "Tên cổng thông tin",
      type: "string",
      group: "general",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "unitName",
      title: "Tên đơn vị chủ quản",
      type: "string",
      group: "general",
    }),
    defineField({
      name: "description",
      title: "Mô tả ngắn (SEO)",
      type: "text",
      rows: 3,
      group: "general",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "general",
    }),
    defineField({
      name: "contact",
      title: "Thông tin liên hệ",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "address", title: "Địa chỉ", type: "string" }),
        defineField({ name: "phone", title: "Điện thoại", type: "string" }),
        defineField({ name: "hotline", title: "Đường dây nóng", type: "string" }),
        defineField({ name: "fax", title: "Fax", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "workingHours", title: "Giờ làm việc", type: "string" }),
        defineField({
          name: "mapEmbedUrl",
          title: "Link nhúng Google Maps",
          description: "Lấy từ Google Maps → Chia sẻ → Nhúng bản đồ → copy giá trị src.",
          type: "url",
        }),
      ],
    }),
    defineField({
      name: "footerLinkGroups",
      title: "Nhóm liên kết ở chân trang",
      type: "array",
      group: "footer",
      of: [
        defineArrayMember({
          type: "object",
          name: "linkGroup",
          fields: [
            defineField({ name: "title", title: "Tiêu đề nhóm", type: "string" }),
            defineField({
              name: "links",
              title: "Liên kết",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "link",
                  fields: [
                    defineField({ name: "label", title: "Tên", type: "string" }),
                    defineField({ name: "url", title: "URL", type: "url" }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "copyright",
      title: "Dòng bản quyền",
      type: "string",
      group: "footer",
    }),
  ],
  preview: { prepare: () => ({ title: "Cấu hình chung" }) },
});
