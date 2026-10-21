"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { DEMO_MESSAGES } from "@/lib/demo-messages";

// Chế độ demo: các thao tác cần backend (gửi form, tải tệp, quản trị) chỉ hiện thông báo.

const EVENT = "demo-notice";

export function notifyDemo(message: string = DEMO_MESSAGES.default) {
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: message }));
}

/** Toast hiển thị thông báo demo, gắn một lần ở layout. */
export function DemoToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onNotice = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(null), 6000);
    };
    window.addEventListener(EVENT, onNotice);
    return () => {
      window.removeEventListener(EVENT, onNotice);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:justify-end">
      {message && (
        <div
          role="status"
          className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg border border-amber-200 bg-white p-4 shadow-xl ring-1 ring-black/5"
        >
          <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700">
            i
          </span>
          <div className="flex-1 text-sm">
            <p className="font-semibold text-ink">Chưa thiết lập backend</p>
            <p className="mt-1 text-muted">{message}</p>
          </div>
          <button type="button" onClick={() => setMessage(null)} className="rounded p-1 text-muted hover:bg-surface hover:text-ink">
            <span className="sr-only">Đóng</span>
            <span aria-hidden>✕</span>
          </button>
        </div>
      )}
    </div>
  );
}

/** Nút thay cho liên kết/hành động cần backend. */
export function DemoButton({
  children,
  message,
  className,
}: {
  children: ReactNode;
  message?: string;
  className?: string;
}) {
  return (
    <button type="button" onClick={() => notifyDemo(message)} className={className}>
      {children}
    </button>
  );
}
