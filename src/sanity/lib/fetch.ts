import { cacheLife, cacheTag } from "next/cache";
import type { QueryParams } from "next-sanity";
import { isDemoMode } from "../env";
import { client } from "./client";

/**
 * Đọc dữ liệu từ Sanity và cache vô thời hạn theo tag.
 * Webhook /api/revalidate gọi revalidateTag(_type) mỗi khi nội dung thay đổi.
 * Chế độ demo: chạy đúng câu GROQ đó trên dữ liệu mẫu (groq-js), không gọi mạng.
 * Trả về null khi chưa cấu hình Sanity và tắt demo.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
}): Promise<T | null> {
  "use cache";
  cacheLife("max");
  cacheTag("sanity", ...tags);

  if (isDemoMode) return demoFetch<T>(query, params);
  if (!client) return null;
  return client.fetch<T>(query, params);
}

async function demoFetch<T>(query: string, params: QueryParams): Promise<T> {
  const [{ parse, evaluate }, { demoDocuments }] = await Promise.all([
    import("groq-js"),
    import("@/demo/documents"),
  ]);
  const result = await evaluate(parse(query, { params }), { dataset: demoDocuments, params });
  return (await result.get()) as T;
}
