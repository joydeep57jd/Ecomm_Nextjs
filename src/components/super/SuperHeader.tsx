"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ShoppingCart,
  User,
  MapPin,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Phone,
  Tag,
  Sparkles
} from "lucide-react"
import useCart from "@/hooks/useCart"
import { useCartDrawer } from "@/contexts/CartDrawerContext"
import { SearchBar } from "./SearchBar"
import { toNavCategories, type NavCategory } from "./theme"
import { Category } from "@/models/Category.modal"
import LayoutModel from "@/models/Layout.model"
import { setItem } from "@/utils/services/local-storage.service"
import { cn } from "./cn"

export function SuperHeader({
  categories,
  logo,
  topbarTitle,
  topbarLabel,
  layoutModel
}: {
  categories: Category[]
  logo?: string
  topbarTitle?: string
  topbarLabel?: string
  layoutModel?: LayoutModel
}) {
  const navCats = toNavCategories(categories)
  const { state } = useCart()
  const { setOpen } = useCartDrawer()
  const [mobileOpen, setMobileOpen] = useState(false)
  const count = state.cart.length

  // Preserve the legacy side effect: session/login pages read the logo from this localStorage key.
  useEffect(() => {
    if (layoutModel) setItem("layout", layoutModel)
  }, [layoutModel])

  return (
    <div className="tw-scope">
      <header className="sticky top-0 z-40 bg-white/95 text-ink shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur">
        {/* Utility bar */}
        <div className="hidden bg-ink text-white lg:block">
          <div className="container-page flex h-9 items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 text-white/90">
              <MapPin size={13} className="text-brand-400" />
              {topbarLabel || "Fast delivery to your door"}
            </span>
            <span className="inline-flex items-center gap-2 text-white/80">
              <Sparkles size={13} className="text-brand-400" />
              Free delivery on your first order · Mega Sale is live
            </span>
            <span className="inline-flex items-center gap-4">
              {topbarTitle && (
                <a href={`tel:${topbarTitle}`} className="inline-flex items-center gap-1.5 hover:text-brand-400">
                  <Phone size={13} /> {topbarTitle}
                </a>
              )}
              <Link href="/orders" className="hover:text-brand-400">
                Track order
              </Link>
            </span>
          </div>
        </div>

        {/* Main bar */}
        <div className="container-page flex h-16 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-ink hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <Link href="/" className="shrink-0">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="logo" className="h-10 w-auto object-contain" />
            ) : (
              <span className="text-xl font-extrabold text-brand">Super Shop</span>
            )}
          </Link>

          <div className="hidden flex-1 px-4 md:block">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Link
              href="/login"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-slate-100 sm:inline-flex"
            >
              <User size={20} strokeWidth={1.8} />
              <span className="hidden lg:block">Account</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Cart, ${count} items`}
              className="relative inline-flex items-center gap-2 rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98]"
            >
              <ShoppingCart size={19} strokeWidth={2} />
              <span className="hidden lg:block">Cart</span>
              {count > 0 && (
                <span className="nums absolute -right-1.5 -top-1.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-fresh-600 px-1 text-[11px] font-bold text-white ring-2 ring-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search row */}
        <div className="container-page pb-2.5 md:hidden">
          <SearchBar />
        </div>

        {/* Desktop mega nav */}
        <nav className="hidden border-t border-line bg-white lg:block">
          <div className="container-page flex h-11 items-center gap-1">
            <CategoryFlyout categories={navCats} />
            {navCats.slice(0, 6).map((c) => (
              <CategoryItem key={c.id} category={c} />
            ))}
            <span className="mx-1 h-5 w-px bg-line" />
            <Link
              href="/products/search?sort=price-low-to-high"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink hover:bg-brand-50 hover:text-brand-700"
            >
              <span className="inline-flex items-center gap-1.5">
                <Tag size={15} className="text-brand" /> Today&apos;s Deals
              </span>
            </Link>
            <Link
              href="/products/search?sort=date"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink hover:bg-brand-50 hover:text-brand-700"
            >
              New Arrivals
            </Link>
          </div>
        </nav>
      </header>

      {/* Rendered outside <header> — the header's backdrop-filter would otherwise become the
          containing block for this fixed drawer and clip it to the header's height. */}
      <MobileDrawer categories={navCats} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </div>
  )
}

function CategoryItem({ category }: { category: NavCategory }) {
  return (
    <div className="group relative">
      <Link
        href={`/products/search?category=${category.id}`}
        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-ink hover:bg-slate-100"
      >
        {category.name}
        {category.subCategories.length > 0 && (
          <ChevronDown size={14} className="text-muted transition group-hover:rotate-180" />
        )}
      </Link>
      {category.subCategories.length > 0 && (
        <div className="invisible absolute left-0 top-full z-50 w-60 translate-y-1 rounded-xl border border-line bg-white p-2 opacity-0 shadow-pop transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          <span
            className="block px-2 py-1 text-2xs font-semibold uppercase tracking-wide"
            style={{ color: category.theme.accent }}
          >
            {category.theme.tagline}
          </span>
          {category.subCategories.map((s) => (
            <Link
              key={s.id}
              href={`/products/search?subCategory=${s.id}`}
              className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-ink"
            >
              {s.name}
              <ChevronRight size={14} className="text-slate-300" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryFlyout({ categories }: { categories: NavCategory[] }) {
  if (!categories.length) return null
  return (
    <div className="group relative">
      <button className="inline-flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700">
        <Menu size={16} /> All Categories
      </button>
      <div className="invisible absolute left-0 top-full z-50 grid w-[680px] translate-y-1 grid-cols-3 gap-2 rounded-2xl border border-line bg-white p-3 opacity-0 shadow-pop transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        {categories.slice(0, 9).map((c) => (
          <div key={c.id} className="rounded-xl p-3" style={{ background: c.theme.bg }}>
            <Link
              href={`/products/search?category=${c.id}`}
              className="text-sm font-bold"
              style={{ color: c.theme.color }}
            >
              {c.name}
            </Link>
            <ul className="mt-1.5 space-y-0.5">
              {c.subCategories.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/products/search?subCategory=${s.id}`}
                    className="block rounded px-1 py-1 text-[13px] text-slate-700 hover:text-ink"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function MobileDrawer({
  categories,
  open,
  onClose
}: {
  categories: NavCategory[]
  open: boolean
  onClose: () => void
}) {
  const [openCat, setOpenCat] = useState<string | null>(categories[0]?.id ?? null)
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col bg-white shadow-pop transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Categories"
      >
        <div className="flex items-center justify-between border-b border-line p-4">
          <span className="text-lg font-extrabold text-brand">Menu</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {categories.map((c) => (
            <div key={c.id} className="mb-1 overflow-hidden rounded-xl border border-line">
              <button
                onClick={() => setOpenCat((v) => (v === c.id ? null : c.id))}
                className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-bold"
                style={{ background: c.theme.bg, color: c.theme.color }}
              >
                {c.name}
                {c.subCategories.length > 0 && (
                  <ChevronDown size={16} className={cn("transition", openCat === c.id && "rotate-180")} />
                )}
              </button>
              {openCat === c.id && (
                <ul className="bg-white p-1">
                  <li>
                    <Link
                      onClick={onClose}
                      href={`/products/search?category=${c.id}`}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-brand-700"
                    >
                      View all {c.name}
                    </Link>
                  </li>
                  {c.subCategories.map((s) => (
                    <li key={s.id}>
                      <Link
                        onClick={onClose}
                        href={`/products/search?subCategory=${s.id}`}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-line p-3">
          <Link
            onClick={onClose}
            href="/login"
            className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 text-sm font-medium"
          >
            <User size={18} /> Login / Sign up
          </Link>
        </div>
      </aside>
    </>
  )
}
