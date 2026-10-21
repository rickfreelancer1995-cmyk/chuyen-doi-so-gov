"use server";

import { z } from "zod";
import { DEMO_MESSAGES } from "@/lib/demo-messages";
import { isDemoMode } from "@/sanity/env";
import { writeClient } from "@/sanity/lib/write-client";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[] | undefined>;
  /** Giá trị đã nhập, trả lại khi lỗi để form điền lại. */
  values?: Record<string, string>;
};

const MIN_FILL_MS = 3000; // điền form dưới 3 giây gần như chắc chắn là bot

const optionalText = (max: number) => z.string().trim().max(max, `Tối đa ${max} ký tự`).optional().default("");

const submitter = {
  fullName: z.string().trim().min(2, "Vui lòng nhập họ tên").max(100, "Tối đa 100 ký tự"),
  email: z.email("Email không hợp lệ").max(200),
  phone: z
    .string()
    .trim()
    .regex(/^$|^[0-9+().\s-]{8,20}$/, "Số điện thoại không hợp lệ")
    .optional()
    .default(""),
  address: optionalText(200),
  consent: z.literal("on", "Bạn cần đồng ý để chúng tôi xử lý thông tin"),
};

const questionSchema = z.object({
  ...submitter,
  title: z.string().trim().min(10, "Tiêu đề tối thiểu 10 ký tự").max(200, "Tối đa 200 ký tự"),
  content: z.string().trim().min(20, "Nội dung tối thiểu 20 ký tự").max(5000, "Tối đa 5000 ký tự"),
});

const feedbackSchema = z.object({
  ...submitter,
  kind: z.enum(["gop-y", "hien-ke"]),
  organization: optionalText(200),
  title: z.string().trim().min(10, "Tiêu đề tối thiểu 10 ký tự").max(200, "Tối đa 200 ký tự"),
  content: z.string().trim().min(30, "Nội dung tối thiểu 30 ký tự").max(10000, "Tối đa 10000 ký tự"),
});

function isBot(formData: FormData) {
  if (formData.get("website")) return true; // honeypot: ô ẩn, người thật không điền
  const startedAt = Number(formData.get("startedAt"));
  return startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS;
}

/** Không có startedAt nghĩa là trình duyệt tắt JavaScript (hoặc bot không chạy JS). */
function missingJs(formData: FormData): FormState | null {
  return Number(formData.get("startedAt")) > 0
    ? null
    : { status: "error", message: "Vui lòng bật JavaScript trên trình duyệt rồi gửi lại." };
}

function fields(formData: FormData) {
  const data: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (typeof v === "string" && k !== "website" && k !== "startedAt" && !k.startsWith("$")) data[k] = v;
  }
  return data;
}

const notConfigured = (values: Record<string, string>): FormState => ({
  status: "error",
  message: "Hệ thống tiếp nhận chưa được cấu hình (thiếu SANITY_API_WRITE_TOKEN). Vui lòng liên hệ qua email hoặc điện thoại.",
  values,
});

const demoState: FormState = { status: "error", message: DEMO_MESSAGES.form };

const serverError = (values: Record<string, string>): FormState => ({
  status: "error",
  message: "Không gửi được do lỗi hệ thống. Vui lòng thử lại sau ít phút.",
  values,
});

const invalid = (error: z.ZodError, values: Record<string, string>): FormState => ({
  status: "error",
  message: "Vui lòng kiểm tra lại thông tin.",
  errors: z.flattenError(error).fieldErrors,
  values,
});

export async function submitQuestion(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isDemoMode) return demoState;
  // Bot: giả vờ thành công để không lộ cơ chế chặn
  if (isBot(formData)) return { status: "success" };
  const noJs = missingJs(formData);
  if (noJs) return noJs;

  const values = fields(formData);
  const parsed = questionSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  if (!writeClient) return notConfigured(values);

  const data = { ...parsed.data, consent: undefined };
  try {
    await writeClient.create({
      _type: "question",
      ...data,
      status: "pending",
      isPublic: false,
      submittedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("submitQuestion", err);
    return serverError(values);
  }
  return { status: "success" };
}

export async function submitFeedback(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isDemoMode) return demoState;
  if (isBot(formData)) return { status: "success" };
  const noJs = missingJs(formData);
  if (noJs) return noJs;

  const values = fields(formData);
  const parsed = feedbackSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  if (!writeClient) return notConfigured(values);

  const data = { ...parsed.data, consent: undefined };
  try {
    await writeClient.create({
      _type: "feedback",
      ...data,
      status: "new",
      submittedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("submitFeedback", err);
    return serverError(values);
  }
  return { status: "success" };
}
