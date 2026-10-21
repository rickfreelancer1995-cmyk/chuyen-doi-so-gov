import Form from "next/form";
import Link from "next/link";
import type { Option } from "@/sanity/options";

export type FilterField =
  | { kind: "select"; name: string; label: string; options: Option[]; value: string }
  | { kind: "text"; name: string; label: string; placeholder?: string; value: string };

/**
 * Bộ lọc dạng GET: submit sẽ đổi query string trên URL (?docType=...&year=...),
 * trang đọc searchParams để lọc. Không cần JS phía client.
 */
export function FilterForm({ action, fields }: { action: string; fields: FilterField[] }) {
  return (
    <Form action={action} className="mb-8 grid gap-3 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
      {fields.map((f) => (
        <label key={f.name} className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-muted">{f.label}</span>
          {f.kind === "select" ? (
            <select
              name={f.name}
              defaultValue={f.value}
              className="rounded-md border border-line bg-white px-3 py-2 outline-none focus:border-brand-500"
            >
              <option value="">Tất cả</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.title}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="search"
              name={f.name}
              defaultValue={f.value}
              placeholder={f.placeholder}
              className="rounded-md border border-line bg-white px-3 py-2 outline-none focus:border-brand-500"
            />
          )}
        </label>
      ))}
      <div className="flex items-end gap-2">
        <button type="submit" className="flex-1 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Lọc
        </button>
        <Link href={action} className="rounded-md border border-line bg-white px-4 py-2 text-sm hover:bg-surface">
          Làm mới
        </Link>
      </div>
    </Form>
  );
}
