import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "../env";
import type { SanityImage } from "./types";

const builder = createImageUrlBuilder({ projectId: projectId || "missing", dataset });

export function urlFor(source: SanityImage) {
  return builder.image(source).auto("format");
}

export function hasImage(source?: SanityImage | null): source is SanityImage {
  return Boolean(source?.asset?._ref || source?.demoUrl);
}

/** URL ảnh đã cắt theo kích thước; ảnh demo (SVG trong /public) trả nguyên đường dẫn. */
export function imageUrl(source: SanityImage, width: number, height: number) {
  if (source.demoUrl) return source.demoUrl;
  return urlFor(source).width(width).height(height).fit("crop").url();
}
