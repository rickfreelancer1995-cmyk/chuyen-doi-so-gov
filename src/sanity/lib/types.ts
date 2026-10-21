import type { PortableTextBlock } from "@portabletext/react";

export type SanityImage = {
  _type?: "image";
  asset?: { _ref: string; _type?: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
  /** Chỉ có ở dữ liệu demo: đường dẫn ảnh tĩnh trong /public. */
  demoUrl?: string;
};

export type Attachment = {
  _key: string;
  title?: string;
  url?: string;
  filename?: string;
  extension?: string;
  size?: number;
};

export type SiteSettings = {
  siteName?: string;
  unitName?: string;
  description?: string;
  logo?: SanityImage;
  contact?: {
    address?: string;
    phone?: string;
    hotline?: string;
    fax?: string;
    email?: string;
    workingHours?: string;
    mapEmbedUrl?: string;
  };
  footerLinkGroups?: {
    _key: string;
    title?: string;
    links?: { _key: string; label?: string; url?: string }[];
  }[];
  copyright?: string;
};

export type Banner = {
  _id: string;
  title: string;
  subtitle?: string;
  image?: SanityImage;
  ctaLabel?: string;
  ctaUrl?: string;
};

export type Card = {
  _id: string;
  _type: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: SanityImage;
  publishedAt?: string;
  label?: string;
};

export type PostDetail = Card & {
  body?: PortableTextBlock[];
  attachments?: Attachment[];
  source?: string;
  category?: { title: string; slug: string };
};

export type LegalDoc = {
  _id: string;
  code: string;
  title: string;
  docType?: string;
  field?: string;
  issuer?: string;
  signer?: string;
  issuedAt?: string;
  effectiveAt?: string;
  status?: string;
  fileUrl?: string;
  externalUrl?: string;
};

export type Problem = Card & {
  pillar?: string;
  sector?: string;
  audiences?: string[];
  adminLevel?: string;
  proposer?: string;
};

export type ProblemDetail = Problem & {
  body?: PortableTextBlock[];
  attachments?: Attachment[];
};

export type Story = Card & { locality?: string; pillar?: string; sector?: string };

export type Knowledge = Card & { topic?: string; format?: string };

export type KnowledgeDetail = Knowledge & {
  videoUrl?: string;
  body?: PortableTextBlock[];
  attachments?: Attachment[];
};

export type Indicator = {
  _id: string;
  title: string;
  group: string;
  unit?: string;
  description?: string;
  target?: { value?: number; year?: number };
  series?: { _key: string; year: number; value: number }[];
  source?: string;
};

export type ToolLink = {
  _id: string;
  title: string;
  description?: string;
  url: string;
  logo?: SanityImage;
};

export type Page = {
  _id: string;
  title: string;
  slug: string;
  body?: PortableTextBlock[];
};

export type Service = Card & { body?: PortableTextBlock[] };

export type PublicQuestion = {
  _id: string;
  title: string;
  content?: string;
  answer?: PortableTextBlock[];
  answeredBy?: string;
  answeredAt?: string;
  submittedAt?: string;
};

export type Paged<T> = { items: T[]; total: number };
