import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

const token = process.env.SANITY_API_WRITE_TOKEN;

/** Client có quyền ghi, chỉ dùng trong Server Action để lưu form người dân gửi. */
export const writeClient =
  isSanityConfigured && token
    ? createClient({ projectId, dataset, apiVersion, token, useCdn: false })
    : null;
