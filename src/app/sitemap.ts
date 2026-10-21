import type { MetadataRoute } from "next";
import { hrefFor } from "@/lib/routes";
import { sanityFetch } from "@/sanity/lib/fetch";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const staticPaths = [
  "/", "/gioi-thieu", "/tin-tuc", "/thong-bao", "/van-ban", "/cau-chuyen", "/bai-toan",
  "/tri-thuc", "/so-lieu", "/dich-vu", "/hoi-dap", "/gop-y", "/hien-ke", "/lien-he",
];
const types = ["post", "announcement", "story", "problem", "knowledge", "service", "page"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs =
    (await sanityFetch<{ _type: string; slug: string; _updatedAt: string }[]>({
      query: `*[_type in $types && defined(slug.current)]{ _type, "slug": slug.current, _updatedAt }`,
      params: { types },
      tags: types,
    })) ?? [];

  return [
    ...staticPaths.map((p) => ({ url: `${siteUrl}${p}` })),
    ...docs.map((d) => ({ url: `${siteUrl}${hrefFor(d)}`, lastModified: d._updatedAt })),
  ];
}
