import { DEMO_MESSAGES, isDemoFile } from "@/lib/demo-messages";
import { formatDate } from "@/lib/format";
import { DemoButton } from "./demo";
import type { LegalDoc } from "@/sanity/lib/types";
import { legalDocStatuses, legalDocTypes, optionTitle } from "@/sanity/options";
import { Badge, EmptyState } from "./ui";

export function LegalDocTable({ items, compact = false }: { items: LegalDoc[]; compact?: boolean }) {
  if (items.length === 0) return <EmptyState message="Không tìm thấy văn bản phù hợp." />;

  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-brand-700 text-white">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">Số ký hiệu</th>
            <th scope="col" className="px-4 py-3 font-semibold">Trích yếu</th>
            {!compact && <th scope="col" className="px-4 py-3 font-semibold">Loại</th>}
            <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Ban hành</th>
            <th scope="col" className="px-4 py-3 font-semibold"><span className="sr-only">Tải về</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {items.map((d) => {
            const link = d.fileUrl ? `${d.fileUrl}?dl=` : d.externalUrl;
            return (
              <tr key={d._id} className="align-top odd:bg-white even:bg-surface">
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-brand-700">{d.code}</td>
                <td className="px-4 py-3">
                  <p>{d.title}</p>
                  {!compact && (
                    <p className="mt-1 flex flex-wrap gap-2 text-xs text-muted">
                      {d.issuer && <span>{d.issuer}</span>}
                      {d.status && d.status !== "con-hieu-luc" && (
                        <Badge tone="accent">{optionTitle(legalDocStatuses, d.status)}</Badge>
                      )}
                    </p>
                  )}
                </td>
                {!compact && <td className="whitespace-nowrap px-4 py-3">{optionTitle(legalDocTypes, d.docType)}</td>}
                <td className="whitespace-nowrap px-4 py-3">{formatDate(d.issuedAt)}</td>
                <td className="px-4 py-3">
                  {isDemoFile(d.fileUrl) ? (
                    <DemoButton message={DEMO_MESSAGES.file} className="whitespace-nowrap text-brand-600 hover:underline">
                      Tải về
                    </DemoButton>
                  ) : link && (
                    <a
                      href={link}
                      target={d.fileUrl ? undefined : "_blank"}
                      rel="noreferrer"
                      className="whitespace-nowrap text-brand-600 hover:underline"
                    >
                      {d.fileUrl ? "Tải về" : "Xem"}
                    </a>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
