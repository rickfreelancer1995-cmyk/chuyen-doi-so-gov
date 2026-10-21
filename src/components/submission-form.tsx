"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, type FormEvent } from "react";
import type { FormState } from "@/lib/actions";
import { DEMO_MESSAGES } from "@/lib/demo-messages";
import { isDemoMode } from "@/sanity/env";
import { notifyDemo } from "./demo";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  required?: boolean;
  placeholder?: string;
  rows?: number;
  full?: boolean;
};

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  fields: FieldDef[];
  hidden?: Record<string, string>;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
};

const initial: FormState = { status: "idle" };

export function SubmissionForm({ action, fields, hidden = {}, submitLabel, successTitle, successMessage }: Props) {
  const [state, formAction, pending] = useActionState(action, initial);
  // Ghi thời điểm mở form để server loại bot điền quá nhanh. Gán vào defaultValue
  // (không phải value) để giá trị còn nguyên sau khi React reset form.
  const startedAtRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.defaultValue = String(Date.now());
  }, []);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
        <p className="text-lg font-semibold text-emerald-800">{successTitle}</p>
        <p className="mt-2 text-emerald-900">{successMessage}</p>
        <Link href="/" className="mt-4 inline-block text-sm font-medium text-brand-600 hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  // Demo: kiểm tra các ô bắt buộc ngay trên trình duyệt rồi báo chưa có backend, không gửi đi
  const onDemoSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget.reportValidity()) notifyDemo(DEMO_MESSAGES.form);
  };

  return (
    <form
      action={formAction}
      onSubmit={isDemoMode ? onDemoSubmit : undefined}
      noValidate={!isDemoMode}
      className="grid gap-5 sm:grid-cols-2"
    >
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <input ref={startedAtRef} type="hidden" name="startedAt" />
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-accent-600 sm:col-span-2">
          {state.message}
        </p>
      )}

      {fields.map((f) => {
        const error = state.errors?.[f.name]?.[0];
        const id = `f-${f.name}`;
        const common = {
          id,
          name: f.name,
          // React reset form sau khi submit; lấy lại giá trị server trả về để không mất nội dung đã nhập
          defaultValue: state.values?.[f.name],
          required: f.required,
          placeholder: f.placeholder,
          "aria-invalid": Boolean(error),
          "aria-describedby": error ? `${id}-err` : undefined,
          className: `w-full rounded-md border bg-white px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${
            error ? "border-accent-500" : "border-line"
          }`,
        };
        return (
          <div key={f.name} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
            <label htmlFor={id} className="mb-1 block text-sm font-medium">
              {f.label} {f.required && <span className="text-accent-500">*</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea rows={f.rows ?? 6} {...common} />
            ) : (
              <input type={f.type ?? "text"} {...common} />
            )}
            {error && (
              <p id={`${id}-err`} className="mt-1 text-sm text-accent-600">
                {error}
              </p>
            )}
          </div>
        );
      })}

      <div className="sm:col-span-2">
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="consent"
            required
            defaultChecked={state.values?.consent === "on"}
            className="mt-1"
            aria-invalid={Boolean(state.errors?.consent)}
          />
          <span>
            Tôi đồng ý để đơn vị tiếp nhận sử dụng họ tên, email, số điện thoại ở trên nhằm trả lời và xử lý nội dung
            tôi gửi. Thông tin cá nhân không được công khai.
          </span>
        </label>
        {state.errors?.consent?.[0] && <p className="mt-1 text-sm text-accent-600">{state.errors.consent[0]}</p>}
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Đang gửi..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
