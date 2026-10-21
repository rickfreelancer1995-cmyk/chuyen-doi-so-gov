import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";
import { DEMO_MESSAGES, isDemoFile } from "@/lib/demo-messages";
import { formatFileSize } from "@/lib/format";
import { DemoButton } from "./demo";
import type { Attachment, SanityImage as SanityImageType } from "@/sanity/lib/types";
import { SanityImage } from "./sanity-image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImageType & { caption?: string } }) => (
      <figure>
        <SanityImage image={value} width={1200} height={750} sizes="(min-width: 768px) 768px, 100vw" className="h-auto w-full" />
        {value.caption && <figcaption>{value.caption}</figcaption>}
      </figure>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = href.startsWith("http");
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
};

export function PortableBody({ value }: { value?: PortableTextBlock[] }) {
  if (!value?.length) return null;
  return (
    <div className="prose-content">
      <PortableText value={value} components={components} />
    </div>
  );
}

export function Attachments({ items }: { items?: Attachment[] }) {
  const files = items?.filter((a) => a.url) ?? [];
  if (files.length === 0) return null;
  return (
    <section className="mt-10 rounded-lg border border-line bg-surface p-5">
      <h2 className="mb-3 font-semibold text-brand-800">Tệp đính kèm</h2>
      <ul className="space-y-2">
        {files.map((f) => {
          const label = (
            <>
              <span aria-hidden className="rounded bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                {f.extension ?? "file"}
              </span>
              {f.title || f.filename}
              {f.size ? <span className="text-xs text-muted">({formatFileSize(f.size)})</span> : null}
            </>
          );
          const className = "inline-flex items-center gap-2 text-left text-brand-600 hover:underline";
          return (
            <li key={f._key}>
              {isDemoFile(f.url) ? (
                <DemoButton message={DEMO_MESSAGES.file} className={className}>
                  {label}
                </DemoButton>
              ) : (
                <a href={`${f.url}?dl=`} className={className}>
                  {label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
