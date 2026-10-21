import { defineQuery } from "next-sanity";
import { sanityFetch } from "./fetch";
import type {
  Banner,
  Card,
  Indicator,
  Knowledge,
  KnowledgeDetail,
  LegalDoc,
  Page,
  Paged,
  PostDetail,
  Problem,
  ProblemDetail,
  PublicQuestion,
  Service,
  SiteSettings,
  Story,
  ToolLink,
} from "./types";

// Mỗi hàm gắn tag theo _type; webhook revalidate đúng tag khi nội dung đổi.

export const PAGE_SIZE = 12;

const card = `_id, _type, title, "slug": slug.current, "excerpt": coalesce(excerpt, summary), coverImage, publishedAt`;
const attachments = `attachments[]{ _key, title, "url": file.asset->url, "filename": file.asset->originalFilename, "extension": file.asset->extension, "size": file.asset->size }`;
const legalDoc = `_id, code, title, docType, field, issuer, signer, issuedAt, effectiveAt, status, "fileUrl": file.asset->url, externalUrl`;

const emptyPage = <T>(): Paged<T> => ({ items: [], total: 0 });
const range = (page: number) => ({
  start: (page - 1) * PAGE_SIZE,
  end: page * PAGE_SIZE,
});

/* ---------- Chung ---------- */

/**
 * Slug để prerender lúc build. Cache Components bắt buộc generateStaticParams
 * trả về ít nhất 1 phần tử, nên khi chưa có dữ liệu dùng slug giả (trang sẽ notFound).
 */
export async function getStaticSlugs(type: string, limit = 50) {
  const data = await sanityFetch<string[]>({
    query: defineQuery(
      `*[_type == $type && defined(slug.current)] | order(_updatedAt desc)[0...$limit].slug.current`,
    ),
    params: { type, limit },
    tags: [type],
  });
  const slugs = data?.length ? data : ["__placeholder__"];
  return slugs.map((slug) => ({ slug }));
}

export async function getSiteSettings() {
  return sanityFetch<SiteSettings>({
    query: defineQuery(`*[_id == "siteSettings"][0]`),
    tags: ["siteSettings"],
  });
}

export async function getBanners() {
  const data = await sanityFetch<Banner[]>({
    query: defineQuery(
      `*[_type == "banner" && active != false] | order(order asc){ _id, title, subtitle, image, ctaLabel, ctaUrl }`,
    ),
    tags: ["banner"],
  });
  return data ?? [];
}

/* ---------- Tin tức ---------- */

export async function getCategories() {
  const data = await sanityFetch<{ title: string; slug: string }[]>({
    query: defineQuery(
      `*[_type == "category"] | order(order asc){ title, "slug": slug.current }`,
    ),
    tags: ["category"],
  });
  return data ?? [];
}

export async function getFeaturedPosts(limit = 5) {
  // Ưu tiên tin nổi bật, thiếu thì lấy tin mới nhất bù vào.
  const data = await sanityFetch<Card[]>({
    query: defineQuery(
      `*[_type == "post"] | order(featured desc, publishedAt desc)[0...$limit]{ ${card}, "label": category->title }`,
    ),
    params: { limit },
    tags: ["post", "category"],
  });
  return data ?? [];
}

export async function getPosts({ page, category }: { page: number; category: string }) {
  const data = await sanityFetch<Paged<Card>>({
    query: defineQuery(`{
      "items": *[_type == "post" && ($category == "" || category->slug.current == $category)]
        | order(publishedAt desc)[$start...$end]{ ${card}, "label": category->title },
      "total": count(*[_type == "post" && ($category == "" || category->slug.current == $category)])
    }`),
    params: { category, ...range(page) },
    tags: ["post", "category"],
  });
  return data ?? emptyPage<Card>();
}

export async function getPost(slug: string) {
  return sanityFetch<PostDetail>({
    query: defineQuery(`*[_type == "post" && slug.current == $slug][0]{
      ${card}, body, source, ${attachments},
      "category": category->{ title, "slug": slug.current }
    }`),
    params: { slug },
    tags: ["post", "category"],
  });
}

export async function getRelatedPosts(slug: string, limit = 4) {
  const data = await sanityFetch<Card[]>({
    query: defineQuery(
      `*[_type == "post" && slug.current != $slug] | order(publishedAt desc)[0...$limit]{ ${card} }`,
    ),
    params: { slug, limit },
    tags: ["post"],
  });
  return data ?? [];
}

/* ---------- Thông báo ---------- */

export async function getAnnouncements({ page }: { page: number }) {
  const data = await sanityFetch<Paged<Card & { important?: boolean }>>({
    query: defineQuery(`{
      "items": *[_type == "announcement"] | order(important desc, publishedAt desc)[$start...$end]{ ${card}, important },
      "total": count(*[_type == "announcement"])
    }`),
    params: range(page),
    tags: ["announcement"],
  });
  return data ?? emptyPage<Card & { important?: boolean }>();
}

export async function getLatestAnnouncements(limit = 5) {
  const data = await sanityFetch<(Card & { important?: boolean })[]>({
    query: defineQuery(
      `*[_type == "announcement"] | order(important desc, publishedAt desc)[0...$limit]{ ${card}, important }`,
    ),
    params: { limit },
    tags: ["announcement"],
  });
  return data ?? [];
}

export async function getAnnouncement(slug: string) {
  return sanityFetch<PostDetail>({
    query: defineQuery(
      `*[_type == "announcement" && slug.current == $slug][0]{ ${card}, body, ${attachments} }`,
    ),
    params: { slug },
    tags: ["announcement"],
  });
}

/* ---------- Văn bản ---------- */

export type LegalDocFilter = {
  page: number;
  q: string;
  docType: string;
  field: string;
  year: string;
};

export async function getLegalDocs(f: LegalDocFilter) {
  const filter = `_type == "legalDocument"
    && ($docType == "" || docType == $docType)
    && ($field == "" || field == $field)
    && ($year == "" || string::startsWith(issuedAt, $year))
    && ($q == "" || code match $q || title match $q || issuer match $q)`;
  const data = await sanityFetch<Paged<LegalDoc>>({
    query: defineQuery(`{
      "items": *[${filter}] | order(issuedAt desc)[$start...$end]{ ${legalDoc} },
      "total": count(*[${filter}])
    }`),
    params: {
      docType: f.docType,
      field: f.field,
      year: f.year,
      q: f.q ? `${f.q}*` : "",
      ...range(f.page),
    },
    tags: ["legalDocument"],
  });
  return data ?? emptyPage<LegalDoc>();
}

export async function getLatestLegalDocs(limit = 5) {
  const data = await sanityFetch<LegalDoc[]>({
    query: defineQuery(
      `*[_type == "legalDocument"] | order(issuedAt desc)[0...$limit]{ ${legalDoc} }`,
    ),
    params: { limit },
    tags: ["legalDocument"],
  });
  return data ?? [];
}

export async function getLegalDocYears() {
  const data = await sanityFetch<string[]>({
    query: defineQuery(`array::unique(*[_type == "legalDocument" && defined(issuedAt)].issuedAt)`),
    tags: ["legalDocument"],
  });
  return [...new Set((data ?? []).map((d) => d.slice(0, 4)))].sort().reverse();
}

/* ---------- Câu chuyện, bài toán, tri thức ---------- */

const storyFields = `${card}, locality, pillar, sector, "label": locality`;

export async function getStories({ page }: { page: number }) {
  const data = await sanityFetch<Paged<Story>>({
    query: defineQuery(`{
      "items": *[_type == "story"] | order(publishedAt desc)[$start...$end]{ ${storyFields} },
      "total": count(*[_type == "story"])
    }`),
    params: range(page),
    tags: ["story"],
  });
  return data ?? emptyPage<Story>();
}

export async function getLatestStories(limit = 3) {
  const data = await sanityFetch<Story[]>({
    query: defineQuery(
      `*[_type == "story"] | order(publishedAt desc)[0...$limit]{ ${storyFields} }`,
    ),
    params: { limit },
    tags: ["story"],
  });
  return data ?? [];
}

export async function getStory(slug: string) {
  return sanityFetch<PostDetail & Story>({
    query: defineQuery(
      `*[_type == "story" && slug.current == $slug][0]{ ${storyFields}, body }`,
    ),
    params: { slug },
    tags: ["story"],
  });
}

export type ProblemFilter = {
  page: number;
  pillar: string;
  sector: string;
  audience: string;
  adminLevel: string;
};

const problemFields = `${card}, pillar, sector, audiences, adminLevel, proposer`;

export async function getProblems(f: ProblemFilter) {
  const filter = `_type == "problem"
    && ($pillar == "" || pillar == $pillar)
    && ($sector == "" || sector == $sector)
    && ($audience == "" || $audience in audiences)
    && ($adminLevel == "" || adminLevel == $adminLevel)`;
  const data = await sanityFetch<Paged<Problem>>({
    query: defineQuery(`{
      "items": *[${filter}] | order(publishedAt desc)[$start...$end]{ ${problemFields} },
      "total": count(*[${filter}])
    }`),
    params: {
      pillar: f.pillar,
      sector: f.sector,
      audience: f.audience,
      adminLevel: f.adminLevel,
      ...range(f.page),
    },
    tags: ["problem"],
  });
  return data ?? emptyPage<Problem>();
}

export async function getLatestProblems(limit = 6) {
  const data = await sanityFetch<Problem[]>({
    query: defineQuery(
      `*[_type == "problem"] | order(publishedAt desc)[0...$limit]{ ${problemFields} }`,
    ),
    params: { limit },
    tags: ["problem"],
  });
  return data ?? [];
}

export async function getProblem(slug: string) {
  return sanityFetch<ProblemDetail>({
    query: defineQuery(
      `*[_type == "problem" && slug.current == $slug][0]{ ${problemFields}, body, ${attachments} }`,
    ),
    params: { slug },
    tags: ["problem"],
  });
}

export async function getKnowledgeList({ page, topic }: { page: number; topic: string }) {
  const filter = `_type == "knowledge" && ($topic == "" || topic == $topic)`;
  const data = await sanityFetch<Paged<Knowledge>>({
    query: defineQuery(`{
      "items": *[${filter}] | order(publishedAt desc)[$start...$end]{ ${card}, topic, format },
      "total": count(*[${filter}])
    }`),
    params: { topic, ...range(page) },
    tags: ["knowledge"],
  });
  return data ?? emptyPage<Knowledge>();
}

export async function getKnowledge(slug: string) {
  return sanityFetch<KnowledgeDetail>({
    query: defineQuery(
      `*[_type == "knowledge" && slug.current == $slug][0]{ ${card}, topic, format, videoUrl, body, ${attachments} }`,
    ),
    params: { slug },
    tags: ["knowledge"],
  });
}

/* ---------- Số liệu, công cụ ---------- */

export async function getIndicators({ highlightOnly = false } = {}) {
  const data = await sanityFetch<Indicator[]>({
    query: defineQuery(
      `*[_type == "indicator" && (!$highlightOnly || highlight == true)] | order(order asc){
        _id, title, group, unit, description, target, source,
        "series": series[] | order(year asc)
      }`,
    ),
    params: { highlightOnly },
    tags: ["indicator"],
  });
  return data ?? [];
}

export async function getToolLinks() {
  const data = await sanityFetch<ToolLink[]>({
    query: defineQuery(
      `*[_type == "toolLink"] | order(order asc){ _id, title, description, url, logo }`,
    ),
    tags: ["toolLink"],
  });
  return data ?? [];
}

/* ---------- Giới thiệu, dịch vụ ---------- */

export async function getPages() {
  const data = await sanityFetch<Pick<Page, "_id" | "title" | "slug">[]>({
    query: defineQuery(`*[_type == "page"] | order(order asc){ _id, title, "slug": slug.current }`),
    tags: ["page"],
  });
  return data ?? [];
}

export async function getPage(slug: string) {
  return sanityFetch<Page>({
    query: defineQuery(
      `*[_type == "page" && slug.current == $slug][0]{ _id, title, "slug": slug.current, body }`,
    ),
    params: { slug },
    tags: ["page"],
  });
}

export async function getServices() {
  const data = await sanityFetch<Service[]>({
    query: defineQuery(`*[_type == "service"] | order(order asc){ ${card} }`),
    tags: ["service"],
  });
  return data ?? [];
}

export async function getService(slug: string) {
  return sanityFetch<Service>({
    query: defineQuery(
      `*[_type == "service" && slug.current == $slug][0]{ ${card}, body }`,
    ),
    params: { slug },
    tags: ["service"],
  });
}

/* ---------- Hỏi đáp ---------- */

export async function getPublicQuestions({ page, q }: { page: number; q: string }) {
  // Chỉ lấy câu đã trả lời + được công khai; KHÔNG lấy họ tên, email, SĐT người hỏi.
  const filter = `_type == "question" && status == "answered" && isPublic == true
    && ($q == "" || title match $q || content match $q)`;
  const data = await sanityFetch<Paged<PublicQuestion>>({
    query: defineQuery(`{
      "items": *[${filter}] | order(answeredAt desc)[$start...$end]{
        _id, title, content, answer, answeredBy, answeredAt, submittedAt
      },
      "total": count(*[${filter}])
    }`),
    params: { q: q ? `${q}*` : "", ...range(page) },
    tags: ["question"],
  });
  return data ?? emptyPage<PublicQuestion>();
}

/* ---------- Tìm kiếm ---------- */

export type SearchHit = Card & { code?: string };

export async function search(q: string) {
  if (!q) return [];
  const data = await sanityFetch<SearchHit[]>({
    query: defineQuery(`*[
      _type in ["post", "announcement", "legalDocument", "story", "problem", "knowledge", "service", "page"]
      && (title match $q || code match $q || excerpt match $q || summary match $q || pt::text(body) match $q)
    ] | score(boost(title match $q, 3), boost(code match $q, 3), pt::text(body) match $q)
      | order(_score desc)[0...40]{ ${card}, code }`),
    params: { q: `${q}*` },
    tags: ["post", "announcement", "legalDocument", "story", "problem", "knowledge", "service", "page"],
  });
  return data ?? [];
}
