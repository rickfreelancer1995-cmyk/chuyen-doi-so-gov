import Link from "next/link";
import { formatDate } from "@/lib/format";
import { hrefFor } from "@/lib/routes";
import type { Card } from "@/sanity/lib/types";
import { SanityImage } from "./sanity-image";
import { Badge, EmptyState } from "./ui";

export function ContentCard({ item, showImage = true }: { item: Card; showImage?: boolean }) {
  const href = hrefFor(item);
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-md">
      {showImage && (
        <Link href={href} tabIndex={-1} aria-hidden className="block overflow-hidden">
          <SanityImage
            image={item.coverImage}
            width={640}
            height={400}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted">
          {item.label && <Badge>{item.label}</Badge>}
          {item.publishedAt && <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>}
        </div>
        <h3 className="line-clamp-2 font-semibold leading-snug text-ink group-hover:text-brand-600">
          <Link href={href}>{item.title}</Link>
        </h3>
        {item.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted">{item.excerpt}</p>}
      </div>
    </article>
  );
}

export function CardGrid({ items, empty }: { items: Card[]; empty?: string }) {
  if (items.length === 0) return <EmptyState message={empty} />;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ContentCard key={item._id} item={item} />
      ))}
    </div>
  );
}

/** Dòng tin dạng danh sách gọn: ngày + tiêu đề. */
export function CompactList({ items, empty }: { items: (Card & { important?: boolean })[]; empty?: string }) {
  if (items.length === 0) return <EmptyState message={empty} />;
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => (
        <li key={item._id} className="flex gap-3 py-3">
          {item.publishedAt && (
            <time dateTime={item.publishedAt} className="w-24 shrink-0 text-sm text-muted">
              {formatDate(item.publishedAt)}
            </time>
          )}
          <Link href={hrefFor(item)} className="font-medium hover:text-brand-600">
            {item.important && (
              <span className="mr-2 align-middle">
                <Badge tone="accent">Quan trọng</Badge>
              </span>
            )}
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
