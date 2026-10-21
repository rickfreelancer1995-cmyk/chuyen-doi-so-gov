import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableBody } from "@/components/portable-body";
import { Container, EmptyState, PageHeader } from "@/components/ui";
import { getPage, getPages } from "@/sanity/lib/data";

export const INTRO_SLUG = "gioi-thieu";

/** Trang giới thiệu: nội dung bên phải, menu các trang giới thiệu bên trái. */
export async function IntroView({ slug }: { slug: string }) {
  const [page, pages] = await Promise.all([getPage(slug), getPages()]);
  if (!page && slug !== INTRO_SLUG) notFound();

  const href = (s: string) => (s === INTRO_SLUG ? "/gioi-thieu" : `/gioi-thieu/${s}`);

  return (
    <>
      <PageHeader
        title={page?.title ?? "Giới thiệu"}
        crumbs={slug === INTRO_SLUG ? [{ label: "Giới thiệu" }] : [{ label: "Giới thiệu", href: "/gioi-thieu" }, { label: page?.title ?? "" }]}
      />
      <Container className="grid gap-10 py-10 lg:grid-cols-4">
        {pages.length > 0 && (
          <nav aria-label="Giới thiệu" className="lg:col-span-1">
            <ul className="overflow-hidden rounded-lg border border-line">
              {pages.map((p) => (
                <li key={p._id} className="border-b border-line last:border-0">
                  <Link
                    href={href(p.slug)}
                    aria-current={p.slug === slug ? "page" : undefined}
                    className={`block px-4 py-3 text-sm ${p.slug === slug ? "bg-brand-600 font-semibold text-white" : "hover:bg-surface"}`}
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <div className={pages.length > 0 ? "lg:col-span-3" : "lg:col-span-4"}>
          {page?.body ? <PortableBody value={page.body} /> : <EmptyState message={`Tạo "Trang giới thiệu" có slug "${INTRO_SLUG}" trong Studio để hiện nội dung ở đây.`} />}
        </div>
      </Container>
    </>
  );
}
