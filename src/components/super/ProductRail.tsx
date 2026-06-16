"use client"

import Link from "next/link"
import { useRef } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { ProductCard, type ProductCardData } from "./ProductCard"

export function ProductRail({
  title,
  subtitle,
  href,
  products,
  accent
}: {
  title: string
  subtitle?: string
  href: string
  products: ProductCardData[]
  accent?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  if (!products.length) return null

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: "smooth" })
  }

  return (
    <section className="container-page mt-9" aria-label={title}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2
            className="text-xl font-extrabold text-ink sm:text-2xl"
            style={accent ? { color: accent } : undefined}
          >
            {title}
          </h2>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand"
          >
            View all <ArrowRight size={15} />
          </Link>
          <div className="hidden gap-1 sm:flex">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="grid h-8 w-8 place-items-center rounded-full border border-line bg-white text-ink hover:bg-slate-50"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="grid h-8 w-8 place-items-center rounded-full border border-line bg-white text-ink hover:bg-slate-50"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
      <div ref={ref} className="rail">
        {products.map((p) => (
          <div
            key={p.itemId}
            className="w-[46%] shrink-0 snap-start sm:w-[30%] md:w-[23%] lg:w-[19%] xl:w-[16.2%]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  )
}
