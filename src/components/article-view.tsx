import type { PortableTextBlock } from "@portabletext/react";
import type { ReactNode } from "react";
import { formatDate } from "@/lib/format";
import type { Attachment, SanityImage as SanityImageType } from "@/sanity/lib/types";
import { hasImage } from "@/sanity/lib/image";
import { Attachments, PortableBody } from "./portable-body";
import { SanityImage } from "./sanity-image";
import { Container, PageHeader } from "./ui";

type Props = {
  title: string;
  crumbs: { label: string; href?: string }[];
  publishedAt?: string;
  meta?: ReactNode;
  excerpt?: string;
  coverImage?: SanityImageType;
  body?: PortableTextBlock[];
  attachments?: Attachment[];
  aside?: ReactNode;
  children?: ReactNode;
};

/** Khung trang chi tiết dùng chung: tin tức, thông báo, câu chuyện, tri thức... */
export function ArticleView({
  title,
  crumbs,
  publishedAt,
  meta,
  excerpt,
  coverImage,
  body,
  attachments,
  aside,
  children,
}: Props) {
  return (
    <>
      <PageHeader title={title} crumbs={crumbs} />
      <Container className="grid gap-10 py-10 lg:grid-cols-3">
        <article className="min-w-0 lg:col-span-2">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted">
            {publishedAt && (
              <time dateTime={publishedAt}>Ngày đăng: {formatDate(publishedAt)}</time>
            )}
            {meta}
          </div>
          {excerpt && <p className="mb-6 text-lg font-semibold leading-relaxed text-ink">{excerpt}</p>}
          {hasImage(coverImage) && (
            <SanityImage
              image={coverImage}
              width={1200}
              height={675}
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="mb-8 h-auto w-full rounded-lg"
            />
          )}
          <PortableBody value={body} />
          {children}
          <Attachments items={attachments} />
        </article>
        {aside && <aside className="space-y-8">{aside}</aside>}
      </Container>
    </>
  );
}
