import type { Metadata } from "next";
import { FeedbackPage } from "@/components/feedback-page";

export const metadata: Metadata = { title: "Góp ý" };

export default function FeedbackRoute() {
  return (
    <FeedbackPage
      kind="gop-y"
      title="Góp ý"
      description="Góp ý về hoạt động, dịch vụ số và nội dung của cổng thông tin."
      titleLabel="Tiêu đề góp ý"
      contentLabel="Nội dung góp ý"
      guide={
        <div className="rounded-lg bg-surface p-5">
          <p className="mb-2 font-semibold text-ink">Lưu ý khi gửi góp ý</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Nêu rõ vấn đề, dịch vụ hoặc trang nội dung cần góp ý.</li>
            <li>Sử dụng ngôn ngữ phù hợp, không đính kèm thông tin cá nhân của người khác.</li>
            <li>Với khiếu nại, tố cáo, vui lòng gửi theo quy định tại cơ quan có thẩm quyền.</li>
          </ul>
        </div>
      }
    />
  );
}
