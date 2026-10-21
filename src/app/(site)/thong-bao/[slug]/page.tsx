import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article-view";
import { getAnnouncement, getStaticSlugs } from "@/sanity/lib/data";

export function generateStaticParams() {
  return getStaticSlugs("announcement");
}

export async function generateMetadata({ params }: PageProps<"/thong-bao/[slug]">): Promise<Metadata> {
  const item = await getAnnouncement((await params).slug);
  return item ? { title: item.title, description: item.excerpt } : {};
}

export default async function AnnouncementPage({ params }: PageProps<"/thong-bao/[slug]">) {
  const item = await getAnnouncement((await params).slug);
  if (!item) notFound();

  return (
    <ArticleView
      title={item.title}
      crumbs={[{ label: "Thông báo", href: "/thong-bao" }]}
      publishedAt={item.publishedAt}
      excerpt={item.excerpt}
      body={item.body}
      attachments={item.attachments}
    />
  );
}
