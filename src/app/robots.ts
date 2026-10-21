import type { MetadataRoute } from "next";
import { isDemoMode } from "@/sanity/env";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  // Bản demo chứa dữ liệu minh họa: không cho máy tìm kiếm lập chỉ mục
  if (isDemoMode) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
