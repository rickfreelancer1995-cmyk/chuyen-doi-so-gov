import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article-view";
import { Badge } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { getPost, getRelatedPosts, getStaticSlugs } from "@/sanity/lib/data";

export function generateStaticParams() {
  return getStaticSlugs("post");
}

export async function generateMetadata({ params }: PageProps<"/tin-tuc/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function PostPage({ params }: PageProps<"/tin-tuc/[slug]">) {
  const { slug } = await params;
  const [post, related] = await Promise.all([getPost(slug), getRelatedPosts(slug)]);
  if (!post) notFound();

  return (
    <ArticleView
      title={post.title}
      crumbs={[{ label: "Tin tức", href: "/tin-tuc" }, ...(post.category ? [{ label: post.category.title, href: `/tin-tuc?chuyenmuc=${post.category.slug}` }] : [])]}
      publishedAt={post.publishedAt}
      meta={
        <>
          {post.category && <Badge>{post.category.title}</Badge>}
          {post.source && <span>Nguồn: {post.source}</span>}
        </>
      }
      excerpt={post.excerpt}
      coverImage={post.coverImage}
      body={post.body}
      attachments={post.attachments}
      aside={
        related.length > 0 && (
          <section>
            <h2 className="mb-3 border-b-2 border-accent-500 pb-2 font-bold uppercase text-brand-800">Tin khác</h2>
            <ul className="divide-y divide-line">
              {related.map((r) => (
                <li key={r._id} className="py-3">
                  <Link href={`/tin-tuc/${r.slug}`} className="font-medium hover:text-brand-600">
                    {r.title}
                  </Link>
                  <time dateTime={r.publishedAt} className="mt-1 block text-xs text-muted">
                    {formatDate(r.publishedAt)}
                  </time>
                </li>
              ))}
            </ul>
          </section>
        )
      }
    />
  );
}
