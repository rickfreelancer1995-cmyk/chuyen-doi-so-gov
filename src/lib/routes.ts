/** Đường dẫn ngoài site theo loại tài liệu Sanity. */
const basePaths: Record<string, string> = {
  post: "/tin-tuc",
  announcement: "/thong-bao",
  story: "/cau-chuyen",
  problem: "/bai-toan",
  knowledge: "/tri-thuc",
  service: "/dich-vu",
  page: "/gioi-thieu",
};

export const typeLabels: Record<string, string> = {
  post: "Tin tức",
  announcement: "Thông báo",
  legalDocument: "Văn bản",
  story: "Câu chuyện CĐS",
  problem: "Bài toán CĐS",
  knowledge: "Tri thức",
  service: "Dịch vụ",
  page: "Giới thiệu",
};

export function hrefFor(doc: { _type: string; slug?: string; code?: string }) {
  if (doc._type === "legalDocument") {
    return `/van-ban?q=${encodeURIComponent(doc.code ?? "")}`;
  }
  if (doc._type === "page" && doc.slug === "gioi-thieu") return "/gioi-thieu";
  const base = basePaths[doc._type];
  return base && doc.slug ? `${base}/${doc.slug}` : "/";
}
