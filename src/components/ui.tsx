import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

type Crumb = { label: string; href?: string };

/** Dải tiêu đề đầu trang con kèm breadcrumb. */
export function PageHeader({
  title,
  description,
  crumbs = [],
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
}) {
  return (
    <div className="border-b border-line bg-surface">
      <Container className="py-8">
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-brand-600">
                Trang chủ
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-1.5">
                <span aria-hidden>›</span>
                {c.href ? (
                  <Link href={c.href} className="hover:text-brand-600">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-ink">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="text-2xl font-bold text-brand-800 sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-muted">{description}</p>}
      </Container>
    </div>
  );
}

/** Tiêu đề khối trên trang chủ, có link "Xem tất cả". */
export function SectionTitle({ title, href, light = false }: { title: string; href?: string; light?: boolean }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2
        className={`relative pb-2 text-xl font-bold uppercase tracking-wide sm:text-2xl ${
          light ? "text-white" : "text-brand-800"
        } after:absolute after:bottom-0 after:left-0 after:h-1 after:w-14 after:rounded after:bg-accent-500`}
      >
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className={`shrink-0 text-sm font-medium ${light ? "text-brand-100 hover:text-white" : "text-brand-600 hover:text-brand-800"}`}
        >
          Xem tất cả →
        </Link>
      )}
    </div>
  );
}

export function EmptyState({ message = "Chưa có nội dung." }: { message?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-surface px-6 py-12 text-center text-muted">
      {message}
    </div>
  );
}

export function Badge({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "accent" | "gray" }) {
  const tones = {
    brand: "bg-brand-50 text-brand-700",
    accent: "bg-red-50 text-accent-600",
    gray: "bg-surface text-muted",
  };
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function SkeletonList({ rows = 6 }: { rows?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[16/10] rounded-lg bg-surface" />
          <div className="mt-3 h-4 w-3/4 rounded bg-surface" />
          <div className="mt-2 h-4 w-1/2 rounded bg-surface" />
        </div>
      ))}
    </div>
  );
}
