import type { Metadata } from "next";
import Link from "next/link";
import { FeedbackPage } from "@/components/feedback-page";

export const metadata: Metadata = { title: "Hiến kế" };

export default function IdeasRoute() {
  return (
    <FeedbackPage
      kind="hien-ke"
      title="Hiến kế"
      description="Đề xuất ý tưởng, sáng kiến, giải pháp chuyển đổi số."
      titleLabel="Tên ý tưởng, giải pháp"
      contentLabel="Mô tả: vấn đề cần giải quyết, giải pháp đề xuất, nguồn lực cần có, hiệu quả dự kiến"
      guide={
        <div className="space-y-4">
          <div className="rounded-lg bg-surface p-5">
            <p className="mb-2 font-semibold text-ink">Gợi ý nội dung hiến kế</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Vấn đề hoặc bài toán cần giải quyết.</li>
              <li>Giải pháp đề xuất, công nghệ sử dụng.</li>
              <li>Nguồn lực, thời gian triển khai.</li>
              <li>Hiệu quả dự kiến cho người dân, doanh nghiệp, cơ quan nhà nước.</li>
            </ol>
          </div>
          <p>
            Xem các{" "}
            <Link href="/bai-toan" className="text-brand-600 hover:underline">
              bài toán chuyển đổi số
            </Link>{" "}
            đang cần giải pháp.
          </p>
        </div>
      }
    />
  );
}
