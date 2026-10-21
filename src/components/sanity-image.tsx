import NextImage from "next/image";
import { Image } from "next-sanity/image";
import { hasImage, urlFor } from "@/sanity/lib/image";
import type { SanityImage as SanityImageType } from "@/sanity/lib/types";

type Props = {
  image?: SanityImageType | null;
  width: number;
  height: number;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Ảnh từ Sanity CDN, cắt theo hotspot; không có ảnh thì hiện khối màu thay thế. */
export function SanityImage({ image, width, height, alt, className, sizes, priority }: Props) {
  if (!hasImage(image)) {
    return (
      <div
        aria-hidden
        className={`bg-gradient-to-br from-brand-100 to-brand-200 ${className ?? ""}`}
        style={{ aspectRatio: `${width} / ${height}` }}
      />
    );
  }

  // Ảnh demo là SVG tĩnh trong /public, không cần qua bộ tối ưu ảnh
  if (image.demoUrl) {
    return (
      <NextImage
        src={image.demoUrl}
        width={width}
        height={height}
        alt={alt ?? image.alt ?? ""}
        className={className}
        priority={priority}
        unoptimized
      />
    );
  }

  const src = urlFor(image).width(width).height(height).fit("crop").url();
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt ?? image.alt ?? ""}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
