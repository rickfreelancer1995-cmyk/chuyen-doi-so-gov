import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Webhook từ Sanity: mỗi lần publish/xóa tài liệu, xóa cache theo _type.
 * Cấu hình ở sanity.io/manage → API → Webhooks:
 *   URL: https://<domain>/api/revalidate   Method: POST
 *   Projection: {_type, "slug": slug.current}
 *   Secret: giống SANITY_REVALIDATE_SECRET
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Thiếu SANITY_REVALIDATE_SECRET" }, { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string; slug?: string }>(req, secret, true);
    if (!isValidSignature) {
      return NextResponse.json({ message: "Chữ ký không hợp lệ" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: "Thiếu _type trong body" }, { status: 400 });
    }

    // Hết hạn ngay để lần tải trang kế tiếp thấy nội dung mới
    revalidateTag(body._type, { expire: 0 });
    return NextResponse.json({ revalidated: true, tag: body._type });
  } catch (err) {
    console.error("revalidate webhook", err);
    return NextResponse.json({ message: "Lỗi xử lý webhook" }, { status: 500 });
  }
}
