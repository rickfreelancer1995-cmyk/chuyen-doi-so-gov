import Form from "next/form";
import Link from "next/link";
import { DEMO_MESSAGES } from "@/lib/demo-messages";
import { mainNav } from "@/lib/nav";
import { isDemoMode } from "@/sanity/env";
import { getSiteSettings } from "@/sanity/lib/data";
import { DemoButton } from "./demo";
import { MainNav } from "./main-nav";
import { SanityImage } from "./sanity-image";

export async function Header() {
  const settings = await getSiteSettings();
  const contact = settings?.contact;

  return (
    <header>
      <div className="bg-brand-900 text-xs text-brand-100">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {contact?.hotline && (
              <a href={`tel:${contact.hotline.replace(/\s/g, "")}`} className="hover:text-white">
                Đường dây nóng: <strong className="text-white">{contact.hotline}</strong>
              </a>
            )}
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className="hover:text-white">
                Email: {contact.email}
              </a>
            )}
          </div>
          {isDemoMode ? (
            <DemoButton message={DEMO_MESSAGES.admin} className="hover:text-white">
              Đăng nhập quản trị
            </DemoButton>
          ) : (
            <Link href="/studio" className="hover:text-white">
              Đăng nhập quản trị
            </Link>
          )}
        </div>
      </div>

      <div className="border-b-4 border-accent-500 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-4">
            {settings?.logo ? (
              <SanityImage image={settings.logo} width={72} height={72} alt="Logo" className="h-16 w-16 object-contain" priority />
            ) : (
              <span
                aria-hidden
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent-500 text-2xl font-bold text-gold-400"
              >
                ★
              </span>
            )}
            <span>
              {settings?.unitName && (
                <span className="block text-xs font-semibold uppercase tracking-wider text-accent-600 sm:text-sm">
                  {settings.unitName}
                </span>
              )}
              <span className="block text-lg font-bold uppercase leading-tight text-brand-800 sm:text-2xl">
                {settings?.siteName ?? "Cổng thông tin Chuyển đổi số"}
              </span>
            </span>
          </Link>

          <Form action="/tim-kiem" className="flex w-full md:w-80" role="search">
            <label htmlFor="site-search" className="sr-only">
              Tìm kiếm
            </label>
            <input
              id="site-search"
              name="q"
              type="search"
              placeholder="Tìm tin tức, văn bản, tài liệu..."
              className="min-w-0 flex-1 rounded-l-md border border-r-0 border-line px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
            <button type="submit" className="rounded-r-md bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700">
              Tìm
            </button>
          </Form>
        </div>
      </div>

      <MainNav items={mainNav} />
    </header>
  );
}
