import Link from "next/link";
import { BannerSlider } from "@/components/banner-slider";
import { CompactList, ContentCard } from "@/components/content-card";
import { IndicatorCard } from "@/components/indicator-card";
import { LegalDocTable } from "@/components/legal-doc-table";
import { SanityImage } from "@/components/sanity-image";
import { Badge, Container, EmptyState, SectionTitle } from "@/components/ui";
import { formatDate } from "@/lib/format";
import {
  getBanners,
  getFeaturedPosts,
  getIndicators,
  getLatestAnnouncements,
  getLatestLegalDocs,
  getLatestProblems,
  getLatestStories,
  getServices,
  getToolLinks,
} from "@/sanity/lib/data";
import { hasImage, imageUrl } from "@/sanity/lib/image";
import { optionTitle, pillars } from "@/sanity/options";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Container className="grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FeaturedNews />
        </div>
        <aside>
          <Announcements />
        </aside>
      </Container>
      <HighlightIndicators />
      <Container className="py-12">
        <Stories />
      </Container>
      <div className="bg-surface">
        <Container className="py-12">
          <Problems />
        </Container>
      </div>
      <Container className="grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LatestDocs />
        </div>
        <InteractionBox />
      </Container>
      <Container className="pb-12">
        <Services />
      </Container>
      <div className="border-t border-line bg-surface">
        <Container className="py-12">
          <Tools />
        </Container>
      </div>
    </>
  );
}

async function Hero() {
  const banners = await getBanners();
  if (banners.length === 0) {
    return (
      <section className="bg-gradient-to-br from-brand-800 to-brand-600 text-white">
        <Container className="py-16 sm:py-20">
          <h2 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
            Chuyển đổi số vì người dân và doanh nghiệp
          </h2>
          <p className="mt-4 max-w-2xl text-brand-100 sm:text-lg">
            Thông tin, văn bản, tri thức và số liệu về chuyển đổi số. Kênh tiếp nhận hỏi đáp, góp ý và hiến kế.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tin-tuc" className="rounded-md bg-accent-500 px-5 py-2.5 font-semibold hover:bg-accent-600">
              Tin hoạt động
            </Link>
            <Link href="/hoi-dap" className="rounded-md bg-white/10 px-5 py-2.5 font-semibold ring-1 ring-white/40 hover:bg-white/20">
              Gửi câu hỏi
            </Link>
          </div>
        </Container>
      </section>
    );
  }
  const slides = banners.map((b) => ({
    _id: b._id,
    title: b.title,
    subtitle: b.subtitle,
    ctaLabel: b.ctaLabel,
    ctaUrl: b.ctaUrl,
    imageUrl: hasImage(b.image) ? imageUrl(b.image, 1920, 640) : undefined,
  }));
  return <BannerSlider slides={slides} />;
}

async function FeaturedNews() {
  const [lead, ...rest] = await getFeaturedPosts(5);
  return (
    <section>
      <SectionTitle title="Tin nổi bật" href="/tin-tuc" />
      {!lead ? (
        <EmptyState message="Chưa có tin tức." />
      ) : (
        <div className="grid gap-6 md:grid-cols-5">
          <article className="group md:col-span-3">
            <Link href={`/tin-tuc/${lead.slug}`} className="block overflow-hidden rounded-lg">
              <SanityImage
                image={lead.coverImage}
                width={960}
                height={600}
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </Link>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted">
              {lead.label && <Badge>{lead.label}</Badge>}
              <time dateTime={lead.publishedAt}>{formatDate(lead.publishedAt)}</time>
            </div>
            <h3 className="mt-2 text-xl font-bold leading-snug group-hover:text-brand-600">
              <Link href={`/tin-tuc/${lead.slug}`}>{lead.title}</Link>
            </h3>
            {lead.excerpt && <p className="mt-2 line-clamp-3 text-muted">{lead.excerpt}</p>}
          </article>
          <ul className="space-y-4 md:col-span-2">
            {rest.map((p) => (
              <li key={p._id} className="group flex gap-3">
                <Link href={`/tin-tuc/${p.slug}`} tabIndex={-1} aria-hidden className="shrink-0 overflow-hidden rounded">
                  <SanityImage image={p.coverImage} width={240} height={160} sizes="120px" className="h-20 w-28 object-cover" />
                </Link>
                <div>
                  <h3 className="line-clamp-3 text-sm font-semibold leading-snug group-hover:text-brand-600">
                    <Link href={`/tin-tuc/${p.slug}`}>{p.title}</Link>
                  </h3>
                  <time dateTime={p.publishedAt} className="mt-1 block text-xs text-muted">
                    {formatDate(p.publishedAt)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

async function Announcements() {
  const items = await getLatestAnnouncements(6);
  return (
    <section>
      <SectionTitle title="Thông báo" href="/thong-bao" />
      <CompactList items={items} empty="Chưa có thông báo." />
    </section>
  );
}

async function HighlightIndicators() {
  const items = await getIndicators({ highlightOnly: true });
  if (items.length === 0) return null;
  return (
    <section className="bg-brand-800 py-12">
      <Container>
        <SectionTitle title="Số liệu chuyển đổi số" href="/so-lieu" light />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(0, 8).map((i) => (
            <IndicatorCard key={i._id} item={i} compact />
          ))}
        </div>
      </Container>
    </section>
  );
}

async function Stories() {
  const items = await getLatestStories(3);
  return (
    <section>
      <SectionTitle title="Câu chuyện chuyển đổi số" href="/cau-chuyen" />
      {items.length === 0 ? (
        <EmptyState message="Chưa có câu chuyện." />
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((s) => (
            <ContentCard key={s._id} item={s} />
          ))}
        </div>
      )}
    </section>
  );
}

async function Problems() {
  const items = await getLatestProblems(6);
  return (
    <section>
      <SectionTitle title="Bài toán chuyển đổi số" href="/bai-toan" />
      {items.length === 0 ? (
        <EmptyState message="Chưa có bài toán." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Link
              key={p._id}
              href={`/bai-toan/${p.slug}`}
              className="group rounded-lg border border-line bg-white p-5 transition hover:border-brand-200 hover:shadow-md"
            >
              {p.pillar && <Badge>{optionTitle(pillars, p.pillar)}</Badge>}
              <h3 className="mt-3 line-clamp-2 font-semibold group-hover:text-brand-600">{p.title}</h3>
              {p.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted">{p.excerpt}</p>}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

async function LatestDocs() {
  const items = await getLatestLegalDocs(5);
  return (
    <section>
      <SectionTitle title="Văn bản mới" href="/van-ban" />
      <LegalDocTable items={items} compact />
    </section>
  );
}

function InteractionBox() {
  const links = [
    { href: "/hoi-dap", title: "Hỏi đáp", desc: "Gửi câu hỏi về chuyển đổi số, xem câu trả lời của cơ quan chức năng." },
    { href: "/gop-y", title: "Góp ý", desc: "Góp ý về hoạt động, dịch vụ số và nội dung của cổng thông tin." },
    { href: "/hien-ke", title: "Hiến kế", desc: "Đề xuất ý tưởng, giải pháp chuyển đổi số cho địa phương." },
  ];
  return (
    <aside>
      <SectionTitle title="Tương tác" />
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="block rounded-lg border-l-4 border-accent-500 bg-surface p-4 hover:bg-brand-50">
              <span className="font-semibold text-brand-800">{l.title} →</span>
              <span className="mt-1 block text-sm text-muted">{l.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

async function Services() {
  const items = await getServices();
  if (items.length === 0) return null;
  return (
    <section>
      <SectionTitle title="Dịch vụ" href="/dich-vu" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 6).map((s, i) => (
          <Link key={s._id} href={`/dich-vu/${s.slug}`} className="group flex gap-4 rounded-lg border border-line p-5 hover:shadow-md">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-lg font-bold text-brand-600">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              <span className="block font-semibold group-hover:text-brand-600">{s.title}</span>
              {s.excerpt && <span className="mt-1 line-clamp-2 block text-sm text-muted">{s.excerpt}</span>}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

async function Tools() {
  const items = await getToolLinks();
  if (items.length === 0) return null;
  return (
    <section>
      <SectionTitle title="Nền tảng, công cụ hỗ trợ" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((t) => (
          <a
            key={t._id}
            href={t.url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 rounded-lg border border-line bg-white p-4 hover:border-brand-200 hover:shadow-md"
          >
            {t.logo ? (
              <SanityImage image={t.logo} width={96} height={96} className="h-12 w-12 shrink-0 object-contain" alt="" />
            ) : (
              <span aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
                {t.title.charAt(0)}
              </span>
            )}
            <span>
              <span className="block font-semibold group-hover:text-brand-600">{t.title} ↗</span>
              {t.description && <span className="mt-1 line-clamp-2 block text-xs text-muted">{t.description}</span>}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
