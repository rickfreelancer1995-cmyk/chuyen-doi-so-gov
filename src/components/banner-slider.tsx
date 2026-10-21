"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export type Slide = {
  _id: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
};

const INTERVAL = 6000;

export function BannerSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => clearInterval(id);
  }, [count, paused]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Banner"
      className="relative overflow-hidden bg-brand-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative h-[360px] sm:h-[420px]">
        {slides.map((s, i) => (
          <div
            key={s._id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${count}`}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            {s.imageUrl && (
              // Ảnh đã được Sanity CDN resize sẵn
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/60 to-transparent" />
            <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6">
              <h2 className="max-w-2xl text-2xl font-bold leading-tight text-white sm:text-4xl">{s.title}</h2>
              {s.subtitle && <p className="mt-4 max-w-xl text-brand-100 sm:text-lg">{s.subtitle}</p>}
              {s.ctaUrl && (
                <Link
                  href={s.ctaUrl}
                  tabIndex={i === index ? 0 : -1}
                  className="mt-6 inline-flex w-fit items-center rounded-md bg-accent-500 px-5 py-2.5 font-semibold text-white hover:bg-accent-600"
                >
                  {s.ctaLabel || "Xem chi tiết"}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-xl text-white hover:bg-white/30 sm:flex"
          >
            <span className="sr-only">Banner trước</span>‹
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-xl text-white hover:bg-white/30 sm:flex"
          >
            <span className="sr-only">Banner sau</span>›
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s._id}
                type="button"
                onClick={() => go(i)}
                aria-current={i === index}
                className={`h-2.5 rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
              >
                <span className="sr-only">Chuyển tới banner {i + 1}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
