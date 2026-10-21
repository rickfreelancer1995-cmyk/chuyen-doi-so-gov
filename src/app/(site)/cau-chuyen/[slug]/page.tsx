import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article-view";
import { Badge } from "@/components/ui";
import { getStaticSlugs, getStory } from "@/sanity/lib/data";
import { optionTitle, pillars, sectors } from "@/sanity/options";

export function generateStaticParams() {
  return getStaticSlugs("story");
}

export async function generateMetadata({ params }: PageProps<"/cau-chuyen/[slug]">): Promise<Metadata> {
  const item = await getStory((await params).slug);
  return item ? { title: item.title, description: item.excerpt } : {};
}

export default async function StoryPage({ params }: PageProps<"/cau-chuyen/[slug]">) {
  const item = await getStory((await params).slug);
  if (!item) notFound();

  return (
    <ArticleView
      title={item.title}
      crumbs={[{ label: "Câu chuyện chuyển đổi số", href: "/cau-chuyen" }]}
      publishedAt={item.publishedAt}
      meta={
        <>
          {item.locality && <span>Địa phương: {item.locality}</span>}
          {item.pillar && <Badge>{optionTitle(pillars, item.pillar)}</Badge>}
          {item.sector && <Badge tone="gray">{optionTitle(sectors, item.sector)}</Badge>}
        </>
      }
      excerpt={item.excerpt}
      coverImage={item.coverImage}
      body={item.body}
    />
  );
}
