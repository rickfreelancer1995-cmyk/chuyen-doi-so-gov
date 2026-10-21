import { CogIcon } from "@sanity/icons/Cog";
import { CommentIcon } from "@sanity/icons/Comment";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import type { StructureResolver } from "sanity/structure";

export const SINGLETON_TYPES = new Set(["siteSettings"]);

export const structure: StructureResolver = (S) => {
  const docList = (type: string, title: string) =>
    S.documentTypeListItem(type).title(title);

  const filtered = (title: string, type: string, filter: string) =>
    S.listItem()
      .title(title)
      .child(
        S.documentList()
          .title(title)
          .schemaType(type)
          .filter(filter)
          .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
      );

  return S.list()
    .title("Quản trị nội dung")
    .items([
      S.listItem()
        .title("Cấu hình chung")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),

      S.listItem()
        .title("Tin tức, văn bản")
        .child(
          S.list()
            .title("Tin tức, văn bản")
            .items([
              docList("post", "Tin tức"),
              docList("category", "Chuyên mục tin"),
              docList("announcement", "Thông báo"),
              docList("legalDocument", "Văn bản"),
            ]),
        ),
      S.listItem()
        .title("Chuyển đổi số")
        .child(
          S.list()
            .title("Chuyển đổi số")
            .items([
              docList("story", "Câu chuyện chuyển đổi số"),
              docList("problem", "Bài toán chuyển đổi số"),
              docList("knowledge", "Tri thức"),
              docList("indicator", "Chỉ số, số liệu"),
              docList("toolLink", "Nền tảng, công cụ"),
            ]),
        ),
      S.listItem()
        .title("Đơn vị, trang chủ")
        .child(
          S.list()
            .title("Đơn vị, trang chủ")
            .items([
              docList("page", "Trang giới thiệu"),
              docList("service", "Dịch vụ"),
              docList("banner", "Banner trang chủ"),
            ]),
        ),
      S.divider(),

      S.listItem()
        .title("Hỏi đáp")
        .icon(HelpCircleIcon)
        .child(
          S.list()
            .title("Hỏi đáp")
            .items([
              filtered("Chờ xử lý", "question", '_type == "question" && status == "pending"'),
              filtered("Đã trả lời", "question", '_type == "question" && status == "answered"'),
              filtered("Từ chối", "question", '_type == "question" && status == "rejected"'),
              docList("question", "Tất cả câu hỏi"),
            ]),
        ),
      S.listItem()
        .title("Góp ý, hiến kế")
        .icon(CommentIcon)
        .child(
          S.list()
            .title("Góp ý, hiến kế")
            .items([
              filtered("Mới", "feedback", '_type == "feedback" && status == "new"'),
              filtered("Đang xử lý", "feedback", '_type == "feedback" && status == "processing"'),
              filtered("Đã xử lý", "feedback", '_type == "feedback" && status == "done"'),
              docList("feedback", "Tất cả"),
            ]),
        ),
    ]);
};
