"use client"

import Link from "next/link"
import { currency } from "lib"
import { AddToCart, type SuperCartItem } from "./AddToCart"
import { cn } from "./cn"

export interface ProductCardData extends SuperCartItem {
  category?: string
}

export function ProductCard({ product, className }: { product: ProductCardData; className?: string }) {
  const price = product.price
  const off = product.mrp > price ? Math.round(((product.mrp - price) / product.mrp) * 100) : 0
  const href = `/products/${product.itemId}`

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card",
        "transition-shadow duration-200 hover:shadow-card-hover",
        className
      )}
    >
      <Link
        href={href}
        className="relative block aspect-square overflow-hidden bg-white"
        aria-label={product.name}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-[1.07] sm:p-2"
        />
        {off > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-brand px-2 py-0.5 text-2xs font-bold text-white shadow-sm">
            {off}% OFF
          </span>
        )}
        {!product.stockQty && (
          <span className="absolute right-2 top-2 rounded-md bg-ink/80 px-2 py-0.5 text-2xs font-semibold text-white">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col border-t border-line p-3">
        {product.category && (
          <span className="truncate text-2xs font-semibold uppercase tracking-wide text-muted">
            {product.category}
          </span>
        )}
        <Link
          href={href}
          className="clamp-2 mt-0.5 min-h-[2.5rem] text-[13.5px] font-medium leading-snug text-ink hover:text-brand-700"
        >
          {product.name}
        </Link>

        {/* Price + save reserve consistent height so discounted/plain cards stay aligned */}
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="nums text-base font-bold text-ink">{currency(price)}</span>
          {product.mrp > price && (
            <span className="nums text-xs text-muted line-through">{currency(product.mrp)}</span>
          )}
        </div>
        <span className="nums min-h-[1rem] text-2xs font-semibold text-fresh-700">
          {product.mrp > price ? `Save ${currency(product.mrp - price)}` : ""}
        </span>

        <AddToCart item={product} fullWidth className="mt-3" />
      </div>
    </article>
  )
}
