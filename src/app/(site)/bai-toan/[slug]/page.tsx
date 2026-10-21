import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article-view";
import { getProblem, getStaticSlugs } from "@/sanity/lib/data";
import { adminLevels, audiences, optionTitle, pillars, sectors } from "@/sanity/options";

export function generateStaticParams() {
  return getStaticSlugs("problem");
}

export async function generateMetadata({ params }: PageProps<"/bai-toan/[slug]">): Promise<Metadata> {
  const item = await getProblem((await params).slug);
  return item ? { title: item.title, description: item.excerpt } : {};
}

export default async function ProblemPage({ params }: PageProps<"/bai-toan/[slug]">) {
  const item = await getProblem((await params).slug);
  if (!item) notFound();

  const facts = [
    ["Trụ cột", optionTitle(pillars, item.pillar)],
    ["Lĩnh vực", optionTitle(sectors, item.sector)],
    ["Đối tượng hưởng lợi", item.audiences?.map((a) => optionTitle(audiences, a)).join(", ")],
    ["Cấp hành chính", optionTitle(adminLevels, item.adminLevel)],
    ["Đơn vị đặt bài toán", item.proposer],
  ].filter(([, v]) => v);

  return (
    <ArticleView
      title={item.title}
      crumbs={[{ label: "Bài toán chuyển đổi số", href: "/bai-toan" }]}
      publishedAt={item.publishedAt}
      excerpt={item.excerpt}
      coverImage={item.coverImage}
      body={item.body}
      attachments={item.attachments}
      aside={
        <>
          <section className="rounded-lg border border-line p-5">
            <h2 className="mb-3 font-bold text-brand-800">Thông tin bài toán</h2>
            <dl className="space-y-3 text-sm">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="rounded-lg bg-brand-700 p-5 text-white">
            <h2 className="font-bold">Có giải pháp cho bài toán này?</h2>
            <p className="mt-2 text-sm text-brand-100">Gửi đề xuất của tổ chức, doanh nghiệp qua mục Hiến kế.</p>
            <Link href="/hien-ke" className="mt-4 inline-block rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold hover:bg-accent-600">
              Gửi giải pháp
            </Link>
          </section>
        </>
      }
    />
  );
}
