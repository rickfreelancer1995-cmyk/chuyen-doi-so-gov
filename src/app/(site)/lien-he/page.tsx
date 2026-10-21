import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/ui";
import { getSiteSettings } from "@/sanity/lib/data";

export const metadata: Metadata = { title: "Liên hệ" };

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const c = settings?.contact;
  const rows = [
    ["Địa chỉ", c?.address],
    ["Điện thoại", c?.phone],
    ["Đường dây nóng", c?.hotline],
    ["Fax", c?.fax],
    ["Email", c?.email],
    ["Giờ làm việc", c?.workingHours],
  ].filter(([, v]) => v);

  return (
    <>
      <PageHeader title="Liên hệ" crumbs={[{ label: "Liên hệ" }]} />
      <Container className="grid gap-10 py-10 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold text-brand-800">{settings?.unitName ?? settings?.siteName ?? "Thông tin liên hệ"}</h2>
          <dl className="mt-6 space-y-4">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] gap-2">
                <dt className="text-muted">{k}</dt>
                <dd className="font-medium">
                  {k === "Email" ? <a href={`mailto:${v}`} className="text-brand-600 hover:underline">{v}</a> : v}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 rounded-lg bg-surface p-5">
            <p className="font-semibold">Cần hỏi hoặc góp ý?</p>
            <p className="mt-1 text-sm text-muted">Gửi qua form trực tuyến để được tiếp nhận và trả lời.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/hoi-dap#gui-cau-hoi" className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
                Gửi câu hỏi
              </Link>
              <Link href="/gop-y" className="rounded-md border border-line bg-white px-4 py-2 text-sm font-medium hover:bg-surface">
                Gửi góp ý
              </Link>
            </div>
          </div>
        </section>
        {c?.mapEmbedUrl && (
          <iframe
            src={c.mapEmbedUrl}
            title="Bản đồ"
            className="h-96 w-full rounded-lg border border-line lg:h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </Container>
    </>
  );
}
