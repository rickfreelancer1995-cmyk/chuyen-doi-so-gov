import type { Metadata } from "next";
import { IndicatorCard } from "@/components/indicator-card";
import { Container, EmptyState, PageHeader } from "@/components/ui";
import { getIndicators } from "@/sanity/lib/data";
import { indicatorGroups } from "@/sanity/options";

export const metadata: Metadata = {
  title: "Số liệu chuyển đổi số",
  description: "Số liệu, chỉ tiêu chuyển đổi số theo các trụ cột chính quyền số, kinh tế số, xã hội số.",
};

export default async function IndicatorsPage() {
  const items = await getIndicators();
  const groups = indicatorGroups
    .map((g) => ({ ...g, items: items.filter((i) => i.group === g.value) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageHeader
        title="Số liệu chuyển đổi số"
        description="Kết quả thực hiện so với chỉ tiêu, theo từng trụ cột. Di chuột lên cột để xem giá trị từng năm."
        crumbs={[{ label: "Số liệu" }]}
      />
      <Container className="py-10">
        {groups.length === 0 ? (
          <EmptyState message="Chưa có số liệu." />
        ) : (
          <>
            <nav aria-label="Nhóm chỉ số" className="mb-8 flex flex-wrap gap-2">
              {groups.map((g) => (
                <a key={g.value} href={`#${g.value}`} className="rounded-full bg-surface px-4 py-1.5 text-sm font-medium hover:bg-brand-50">
                  {g.title}
                </a>
              ))}
            </nav>
            <div className="space-y-12">
              {groups.map((g) => (
                <section key={g.value} id={g.value} className="scroll-mt-6">
                  <h2 className="mb-4 text-xl font-bold text-brand-800">{g.title}</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {g.items.map((i) => (
                      <IndicatorCard key={i._id} item={i} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </Container>
    </>
  );
}
