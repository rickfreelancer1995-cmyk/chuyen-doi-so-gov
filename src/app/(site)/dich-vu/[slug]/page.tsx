import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article-view";
import { getService, getServices, getStaticSlugs } from "@/sanity/lib/data";

export function generateStaticParams() {
  return getStaticSlugs("service");
}

export async function generateMetadata({ params }: PageProps<"/dich-vu/[slug]">): Promise<Metadata> {
  const item = await getService((await params).slug);
  return item ? { title: item.title, description: item.excerpt } : {};
}

export default async function ServicePage({ params }: PageProps<"/dich-vu/[slug]">) {
  const { slug } = await params;
  const [item, all] = await Promise.all([getService(slug), getServices()]);
  if (!item) notFound();

  return (
    <ArticleView
      title={item.title}
      crumbs={[{ label: "Dịch vụ", href: "/dich-vu" }]}
      excerpt={item.excerpt}
      coverImage={item.coverImage}
      body={item.body}
      aside={
        <>
          <section>
            <h2 className="mb-3 border-b-2 border-accent-500 pb-2 font-bold uppercase text-brand-800">Dịch vụ khác</h2>
            <ul className="space-y-2">
              {all
                .filter((s) => s.slug !== slug)
                .map((s) => (
                  <li key={s._id}>
                    <Link href={`/dich-vu/${s.slug}`} className="text-sm hover:text-brand-600">
                      {s.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
          <Link href="/lien-he" className="block rounded-lg bg-brand-700 p-5 text-center font-semibold text-white hover:bg-brand-800">
            Liên hệ sử dụng dịch vụ
          </Link>
        </>
      }
    />
  );
}
