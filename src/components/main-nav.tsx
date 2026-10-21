"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavItem } from "@/lib/nav";

function isActive(pathname: string, item: NavItem) {
  if (item.href === "/") return pathname === "/";
  const hrefs = [item.href, ...(item.children?.map((c) => c.href) ?? [])];
  return hrefs.some((h) => pathname === h || pathname.startsWith(`${h}/`));
}

export function MainNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Menu chính" className="bg-brand-700 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:hidden">
        <span className="py-3 text-sm font-semibold uppercase">Danh mục</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="rounded p-2 hover:bg-brand-600"
        >
          <span className="sr-only">{open ? "Đóng menu" : "Mở menu"}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Desktop */}
      <ul className="mx-auto hidden max-w-7xl px-6 lg:flex">
        {items.map((item) => (
          <li key={item.href} className="group relative">
            <Link
              href={item.href}
              className={`block px-4 py-3.5 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-brand-600 ${
                isActive(pathname, item) ? "bg-brand-800" : ""
              }`}
            >
              {item.label}
              {item.children && <span aria-hidden className="ml-1 text-xs opacity-70">▾</span>}
            </Link>
            {item.children && (
              <ul className="invisible absolute left-0 top-full z-30 min-w-60 rounded-b-md bg-white py-2 text-ink opacity-0 shadow-lg ring-1 ring-line transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                {item.children.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className={`block px-4 py-2 text-sm hover:bg-brand-50 hover:text-brand-700 ${
                        pathname === child.href ? "font-semibold text-brand-700" : ""
                      }`}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Mobile */}
      {open && (
        <ul id="mobile-menu" className="border-t border-brand-600 px-4 pb-4 lg:hidden">
          {items.map((item) => (
            <li key={item.href} className="border-b border-brand-600/60 last:border-0">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm font-semibold uppercase"
              >
                {item.label}
              </Link>
              {item.children && (
                <ul className="pb-2 pl-4">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="block py-1.5 text-sm text-brand-100"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
