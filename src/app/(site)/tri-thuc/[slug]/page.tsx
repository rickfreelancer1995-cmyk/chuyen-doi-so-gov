import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article-view";
import { Badge } from "@/components/ui";
import { getKnowledge, getStaticSlugs } from "@/sanity/lib/data";
import { knowledgeFormats, knowledgeTopics, optionTitle } from "@/sanity/options";

export function generateStaticParams() {
  return getStaticSlugs("knowledge");
}

export async function generateMetadata({ params }: PageProps<"/tri-thuc/[slug]">): Promise<Metadata> {
  const item = await getKnowledge((await params).slug);
  return item ? { title: item.title, description: item.excerpt } : {};
}

/** Chuyển link YouTube thường sang link nhúng. */
function youtubeEmbed(url?: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const id = u.hostname.includes("youtu.be") ? u.pathname.slice(1) : u.searchParams.get("v");
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

export default async function KnowledgeDetailPage({ params }: PageProps<"/tri-thuc/[slug]">) {
  const item = await getKnowledge((await params).slug);
  if (!item) notFound();
  const embed = youtubeEmbed(item.videoUrl);

  return (
    <ArticleView
      title={item.title}
      crumbs={[
        { label: "Tri thức", href: "/tri-thuc" },
        ...(item.topic ? [{ label: optionTitle(knowledgeTopics, item.topic), href: `/tri-thuc?chude=${item.topic}` }] : []),
      ]}
      publishedAt={item.publishedAt}
      meta={item.format && <Badge>{optionTitle(knowledgeFormats, item.format)}</Badge>}
      excerpt={item.excerpt}
      coverImage={embed ? undefined : item.coverImage}
      body={item.body}
      attachments={item.attachments}
    >
      {embed && (
        <div className="mt-8 aspect-video overflow-hidden rounded-lg">
          <iframe
            src={embed}
            title={item.title}
            className="h-full w-full"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </ArticleView>
  );
}
