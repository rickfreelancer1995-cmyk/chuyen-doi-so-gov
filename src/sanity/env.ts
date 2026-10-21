export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-10-01";

export const isSanityConfigured = projectId.length > 0;

/**
 * Chế độ demo: đọc dữ liệu mẫu đóng gói sẵn (src/demo) thay vì Sanity.
 * NEXT_PUBLIC_DEMO_MODE:
 *   - để trống: tự bật khi chưa điền NEXT_PUBLIC_SANITY_PROJECT_ID
 *   - "true":   luôn bật (kể cả đã có Sanity)
 *   - "false":  luôn tắt (chưa có Sanity thì site hiện trạng thái trống)
 */
const demoFlag = process.env.NEXT_PUBLIC_DEMO_MODE;
export const isDemoMode = demoFlag === "true" || (!isSanityConfigured && demoFlag !== "false");
