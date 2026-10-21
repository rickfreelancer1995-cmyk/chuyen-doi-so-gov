import type { SchemaTypeDefinition } from "sanity";
import { announcement, banner, category, legalDocument, post } from "./content";
import { feedback, question } from "./interaction";
import { page, service } from "./organization";
import { attachment, blockContent } from "./shared";
import { siteSettings } from "./siteSettings";
import { indicator, knowledge, problem, story, toolLink } from "./transformation";

export const schemaTypes: SchemaTypeDefinition[] = [
  blockContent,
  attachment,
  siteSettings,
  category,
  post,
  announcement,
  legalDocument,
  banner,
  story,
  problem,
  knowledge,
  indicator,
  toolLink,
  page,
  service,
  question,
  feedback,
];
