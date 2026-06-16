"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { BannerOfferResponse } from "@/models/Offer.model"
import { type NavCategory } from "./theme"
import { cn } from "./cn"

interface StaticSlide {
  eyebrow: string
  title: string
  sub: string
  cta: string
  href: string
  gradient: string
  blob: string
}

const STATIC_SLIDES: Omit<StaticSlide, "href">[] = [
  {
    eyebrow: "Mega Sale · Limited time",
    title: "Up to 50% OFF\nacross the store",
    sub: "Our biggest savings yet — shop the deals before they're gone.",
    cta: "Shop the sale",
    gradient: "from-festive-700 via-festive-600 to-brand-600",
    blob: "bg-brand-400/30"
  },
  {
    eyebrow: "Everyday low prices",
    title: "Fresh staples,\nsealed & sorted",
    sub: "The brands you trust — delivered to your door.",
    cta: "Start shopping",
    gradient: "from-fresh-700 via-fresh-600 to-emerald-500",
    blob: "bg-white/20"
  },
  {
    eyebrow: "New season",
    title: "Dress up for\nthe season",
    sub: "Fresh arrivals for the whole family.",
    cta: "Explore new",
    gradient: "from-pink-600 via-festive-600 to-brand-500",
    blob: "bg-amber-300/30"
  }
]

export interface HeroBanner {
  image: string
  title?: string
  href?: string
}

interface ImageSlide {
  key: string
  image: string
  title?: string
  discount?: number
  href?: string
  overlay: boolean
}

export function HeroCarousel({
  banners = [],
  offers,
  categories
}: {
  banners?: HeroBanner[]
  offers: BannerOfferResponse[] | null
  categories: NavCategory[]
}) {
  const [i, setI] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Backend banner sections first, then promotional offers — both render as full-bleed images.
  const imageSlides: ImageSlide[] = [
    // Banner-section images are fully designed (text baked in) — show them as-is, no overlay.
    ...banners
      .filter((b) => !!b.image)
      .map((b, idx) => ({ key: `b${idx}`, image: b.image, title: b.title, href: b.href, overlay: false })),
    ...(offers ?? []).map((o) => ({
      key: `o${o.offerId}`,
      image: o.bannerImageUrl,
      title: o.offerName,
      discount: o.discountPercentage,
      href: `/sales/${btoa(o.offerId.toString())}`,
      overlay: true
    }))
  ]

  const useImages = imageSlides.length > 0
  const count = useImages ? imageSlides.length : STATIC_SLIDES.length

  useEffect(() => {
    setI(0)
  }, [count])

  useEffect(() => {
    if (count <= 1) return
    timer.current = setInterval(() => setI((v) => (v + 1) % count), 5500)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [count])

  const go = (n: number) => setI((n + count) % count)

  return (
    <section className="container-page pt-4" aria-label="Featured offers">
      <div className="group relative overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {useImages
            ? imageSlides.map((s) => {
                const Wrapper = (s.href ? Link : "div") as React.ElementType
                return (
                  <Wrapper key={s.key} {...(s.href ? { href: s.href } : {})} className="w-full shrink-0">
                    <div className="relative w-full overflow-hidden bg-slate-100">
                      {/* Designed banners carry their own text — show full width at natural ratio, never crop. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.image}
                        alt={s.title || "Featured banner"}
                        className="block h-auto w-full"
                      />
                      {s.overlay && s.title && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
                            {!!s.discount && s.discount > 0 && (
                              <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold">
                                {s.discount}% OFF
                              </span>
                            )}
                            <h2 className="mt-3 max-w-lg text-2xl font-extrabold leading-tight sm:text-4xl">
                              {s.title}
                            </h2>
                            {s.href && (
                              <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-ink">
                                Shop now <ArrowRight size={16} />
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </Wrapper>
                )
              })
            : STATIC_SLIDES.map((s, idx) => {
                const href = categories[idx]
                  ? `/products/search?category=${categories[idx].id}`
                  : "/products/search"
                return (
                  <div key={idx} className="w-full shrink-0">
                    <div
                      className={cn(
                        "relative flex min-h-[220px] items-center overflow-hidden bg-gradient-to-br p-6 sm:min-h-[300px] sm:p-10",
                        s.gradient
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-2xl",
                          s.blob
                        )}
                      />
                      <span className="pointer-events-none absolute -bottom-20 right-24 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
                      <div className="relative max-w-lg text-white">
                        <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                          {s.eyebrow}
                        </span>
                        <h2 className="mt-3 whitespace-pre-line text-3xl font-extrabold leading-tight sm:text-5xl">
                          {s.title}
                        </h2>
                        <p className="mt-2 max-w-md text-sm text-white/90 sm:text-base">{s.sub}</p>
                        <Link
                          href={href}
                          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-ink shadow-sm transition hover:gap-3 hover:bg-brand-50"
                        >
                          {s.cta} <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
        </div>

        {count > 1 && (
          <>
            <button
              onClick={() => go(i - 1)}
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink shadow-sm transition hover:bg-white group-hover:grid"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => go(i + 1)}
              aria-label="Next slide"
              className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink shadow-sm transition hover:bg-white group-hover:grid"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {Array.from({ length: count }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => go(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === idx ? "w-6 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
