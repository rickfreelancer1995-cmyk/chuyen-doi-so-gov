import Link from "next/link";
import { getSiteSettings } from "@/sanity/lib/data";
import { Container } from "./ui";

const quickLinks = [
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Văn bản", href: "/van-ban" },
  { label: "Hỏi đáp", href: "/hoi-dap" },
  { label: "Góp ý", href: "/gop-y" },
  { label: "Liên hệ", href: "/lien-he" },
];

export async function Footer() {
  const settings = await getSiteSettings();
  const contact = settings?.contact;

  return (
    <footer className="mt-auto bg-brand-900 text-sm text-brand-100">
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="text-base font-bold uppercase text-white">
            {settings?.siteName ?? "Cổng thông tin Chuyển đổi số"}
          </p>
          {settings?.unitName && <p className="mt-1">Cơ quan chủ quản: {settings.unitName}</p>}
          <ul className="mt-4 space-y-1.5">
            {contact?.address && <li>Địa chỉ: {contact.address}</li>}
            {contact?.phone && <li>Điện thoại: {contact.phone}</li>}
            {contact?.fax && <li>Fax: {contact.fax}</li>}
            {contact?.email && (
              <li>
                Email:{" "}
                <a href={`mailto:${contact.email}`} className="hover:text-white">
                  {contact.email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className="mb-3 font-semibold uppercase text-white">Liên kết nhanh</p>
          <ul className="space-y-1.5">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {settings?.footerLinkGroups?.map((group) => (
          <div key={group._key}>
            <p className="mb-3 font-semibold uppercase text-white">{group.title}</p>
            <ul className="space-y-1.5">
              {group.links?.map((l) => (
                <li key={l._key}>
                  <a href={l.url} target="_blank" rel="noreferrer" className="hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-4 text-xs text-brand-200">
          {settings?.copyright ?? "Bản quyền thuộc về đơn vị chủ quản. Ghi rõ nguồn khi phát hành lại thông tin từ cổng này."}
        </Container>
      </div>
    </footer>
  );
}
