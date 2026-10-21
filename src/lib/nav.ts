export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const mainNav: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  {
    label: "Giới thiệu",
    href: "/gioi-thieu",
    children: [
      { label: "Giới thiệu chung", href: "/gioi-thieu" },
      { label: "Dịch vụ", href: "/dich-vu" },
      { label: "Liên hệ", href: "/lien-he" },
    ],
  },
  {
    label: "Tin tức",
    href: "/tin-tuc",
    children: [
      { label: "Tin hoạt động", href: "/tin-tuc" },
      { label: "Thông báo", href: "/thong-bao" },
    ],
  },
  { label: "Văn bản", href: "/van-ban" },
  {
    label: "Chuyển đổi số",
    href: "/cau-chuyen",
    children: [
      { label: "Câu chuyện chuyển đổi số", href: "/cau-chuyen" },
      { label: "Bài toán chuyển đổi số", href: "/bai-toan" },
      { label: "Tri thức", href: "/tri-thuc" },
    ],
  },
  { label: "Số liệu", href: "/so-lieu" },
  {
    label: "Tương tác",
    href: "/hoi-dap",
    children: [
      { label: "Hỏi đáp", href: "/hoi-dap" },
      { label: "Góp ý", href: "/gop-y" },
      { label: "Hiến kế", href: "/hien-ke" },
    ],
  },
];
