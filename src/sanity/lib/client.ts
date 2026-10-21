import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

// Next.js đã cache kết quả (use cache + cacheTag), nên đọc thẳng API thay vì CDN
// để webhook revalidate xong là lấy được dữ liệu mới ngay.
export const client: SanityClient | null = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: false })
  : null;
