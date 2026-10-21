import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getPage, getStaticSlugs } from "@/sanity/lib/data";
import { INTRO_SLUG, IntroView } from "../intro-view";

export async function generateStaticParams() {
  const params = (await getStaticSlugs("page")).filter((p) => p.slug !== INTRO_SLUG);
  return params.length ? params : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/gioi-thieu/[slug]">): Promise<Metadata> {
  const page = await getPage((await params).slug);
  return page ? { title: page.title } : {};
}

export default async function IntroSubPage({ params }: PageProps<"/gioi-thieu/[slug]">) {
  const { slug } = await params;
  if (slug === INTRO_SLUG) permanentRedirect("/gioi-thieu");
  return <IntroView slug={slug} />;
}
