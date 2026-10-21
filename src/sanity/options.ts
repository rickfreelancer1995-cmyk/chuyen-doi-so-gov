// Các danh mục cố định, dùng chung cho schema Studio và bộ lọc ngoài site.

export type Option = { title: string; value: string };

export const legalDocTypes: Option[] = [
  { title: "Luật", value: "luat" },
  { title: "Nghị quyết", value: "nghi-quyet" },
  { title: "Nghị định", value: "nghi-dinh" },
  { title: "Quyết định", value: "quyet-dinh" },
  { title: "Thông tư", value: "thong-tu" },
  { title: "Chỉ thị", value: "chi-thi" },
  { title: "Kế hoạch", value: "ke-hoach" },
  { title: "Công văn", value: "cong-van" },
  { title: "Tiêu chuẩn, quy chuẩn kỹ thuật", value: "tieu-chuan" },
  { title: "Văn bản khác", value: "khac" },
];

export const legalDocFields: Option[] = [
  { title: "Chuyển đổi số", value: "chuyen-doi-so" },
  { title: "Chính quyền số", value: "chinh-quyen-so" },
  { title: "Kinh tế số", value: "kinh-te-so" },
  { title: "Xã hội số", value: "xa-hoi-so" },
  { title: "Dữ liệu", value: "du-lieu" },
  { title: "An toàn thông tin", value: "an-toan-thong-tin" },
  { title: "Công nghệ thông tin", value: "cong-nghe-thong-tin" },
  { title: "Đầu tư công", value: "dau-tu-cong" },
];

export const legalDocStatuses: Option[] = [
  { title: "Còn hiệu lực", value: "con-hieu-luc" },
  { title: "Hết hiệu lực một phần", value: "het-mot-phan" },
  { title: "Hết hiệu lực", value: "het-hieu-luc" },
];

export const pillars: Option[] = [
  { title: "Chính quyền số", value: "chinh-quyen-so" },
  { title: "Kinh tế số", value: "kinh-te-so" },
  { title: "Xã hội số", value: "xa-hoi-so" },
];

export const sectors: Option[] = [
  { title: "Y tế", value: "y-te" },
  { title: "Giáo dục", value: "giao-duc" },
  { title: "Nông nghiệp", value: "nong-nghiep" },
  { title: "Giao thông, logistics", value: "giao-thong" },
  { title: "Tài chính, ngân hàng", value: "tai-chinh" },
  { title: "Du lịch", value: "du-lich" },
  { title: "Tài nguyên, môi trường", value: "tai-nguyen-moi-truong" },
  { title: "Năng lượng", value: "nang-luong" },
  { title: "Hạ tầng số", value: "ha-tang-so" },
  { title: "Nguồn nhân lực", value: "nhan-luc" },
  { title: "Khác", value: "khac" },
];

export const audiences: Option[] = [
  { title: "Người dân", value: "nguoi-dan" },
  { title: "Doanh nghiệp", value: "doanh-nghiep" },
  { title: "Cơ quan nhà nước", value: "co-quan-nha-nuoc" },
];

export const adminLevels: Option[] = [
  { title: "Trung ương", value: "trung-uong" },
  { title: "Cấp tỉnh", value: "tinh" },
  { title: "Cấp xã", value: "xa" },
];

export const knowledgeTopics: Option[] = [
  { title: "Điều phối chuyển đổi số", value: "dieu-phoi" },
  { title: "Chính quyền số", value: "chinh-quyen-so" },
  { title: "Kinh tế số", value: "kinh-te-so" },
  { title: "Xã hội số", value: "xa-hoi-so" },
  { title: "Dữ liệu", value: "du-lieu" },
  { title: "An toàn thông tin", value: "an-toan-thong-tin" },
  { title: "Phát triển nhân lực", value: "nhan-luc" },
  { title: "Cẩm nang, hướng dẫn", value: "cam-nang" },
];

export const knowledgeFormats: Option[] = [
  { title: "Bài viết", value: "bai-viet" },
  { title: "Tài liệu PDF", value: "tai-lieu" },
  { title: "Báo cáo", value: "bao-cao" },
  { title: "Video", value: "video" },
];

export const indicatorGroups: Option[] = [
  { title: "Chính quyền số", value: "chinh-quyen-so" },
  { title: "Kinh tế số", value: "kinh-te-so" },
  { title: "Xã hội số", value: "xa-hoi-so" },
  { title: "Hạ tầng số", value: "ha-tang-so" },
];

export const questionStatuses: Option[] = [
  { title: "Chờ xử lý", value: "pending" },
  { title: "Đã trả lời", value: "answered" },
  { title: "Từ chối", value: "rejected" },
];

export const feedbackKinds: Option[] = [
  { title: "Góp ý", value: "gop-y" },
  { title: "Hiến kế", value: "hien-ke" },
];

export const feedbackStatuses: Option[] = [
  { title: "Mới", value: "new" },
  { title: "Đang xử lý", value: "processing" },
  { title: "Đã xử lý", value: "done" },
];

export function optionTitle(options: Option[], value?: string | null) {
  return options.find((o) => o.value === value)?.title ?? value ?? "";
}
