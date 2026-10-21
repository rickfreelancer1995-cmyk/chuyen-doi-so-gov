import { formatNumber } from "@/lib/format";
import type { Indicator } from "@/sanity/lib/types";

/** Thẻ chỉ số: giá trị mới nhất, tiến độ so với chỉ tiêu, biểu đồ cột theo năm. */
export function IndicatorCard({ item, compact = false }: { item: Indicator; compact?: boolean }) {
  const series = item.series ?? [];
  const latest = series.at(-1);
  const target = item.target?.value;
  const progress = latest && target ? Math.min(100, (latest.value / target) * 100) : null;
  const unit = item.unit ?? "";
  const withUnit = (v: number) => (unit === "%" ? `${formatNumber(v)}%` : `${formatNumber(v)}${unit ? ` ${unit}` : ""}`);

  return (
    <article className="flex flex-col rounded-lg border border-line bg-white p-5">
      <h3 className="text-sm font-medium text-muted">{item.title}</h3>
      <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
        <span className="text-3xl font-bold text-brand-700">
          {latest ? (unit === "%" ? `${formatNumber(latest.value)}%` : formatNumber(latest.value)) : "—"}
        </span>
        {latest && unit && unit !== "%" && <span className="font-semibold text-brand-700">{unit}</span>}
        {latest && <span className="text-sm text-muted">năm {latest.year}</span>}
      </p>

      {progress !== null && target !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted">
            <span>
              Chỉ tiêu {item.target?.year ? `${item.target.year}` : ""}: {withUnit(target)}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
            <div className={`h-full rounded-full ${progress >= 100 ? "bg-emerald-500" : "bg-brand-500"}`} style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {!compact && series.length > 1 && <MiniBars series={series} format={withUnit} />}
      {!compact && item.description && <p className="mt-3 text-sm text-muted">{item.description}</p>}
      {!compact && item.source && <p className="mt-auto pt-3 text-xs text-muted">Nguồn: {item.source}</p>}
    </article>
  );
}

function MiniBars({ series, format }: { series: { year: number; value: number }[]; format: (v: number) => string }) {
  const max = Math.max(...series.map((d) => d.value), 1);
  return (
    <figure className="mt-4">
      <div className="flex h-28 items-end gap-2" aria-hidden>
        {series.map((d, i) => (
          <div key={d.year} className="group relative flex flex-1 flex-col items-center justify-end">
            <span className="mb-1 text-[10px] text-muted opacity-0 group-hover:opacity-100">{format(d.value)}</span>
            <div
              className={`w-full max-w-10 rounded-t ${i === series.length - 1 ? "bg-brand-600" : "bg-brand-200"}`}
              style={{ height: `${Math.max(4, (d.value / max) * 88)}px` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-2 border-t border-line pt-1">
        {series.map((d) => (
          <span key={d.year} className="flex-1 text-center text-[11px] text-muted">
            {d.year}
          </span>
        ))}
      </div>
      <figcaption className="sr-only">
        {series.map((d) => `${d.year}: ${format(d.value)}`).join("; ")}
      </figcaption>
    </figure>
  );
}
