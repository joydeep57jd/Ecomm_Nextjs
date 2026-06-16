import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { type NavCategory } from "./theme"

const FALLBACK = [
  { title: "Buy more, save more", sub: "Stock up on everyday staples", classes: "from-fresh-600 to-emerald-500" },
  { title: "Festive Edit", sub: "Fresh styles for the season", classes: "from-festive-600 to-pink-500" },
  { title: "Step Out in Style", sub: "Top picks just for you", classes: "from-blue-600 to-sky-500" }
]

/** Three gradient promo cards. Deep-links into real categories when available. */
export function PromoStrip({ categories }: { categories: NavCategory[] }) {
  const promos = FALLBACK.map((p, i) => {
    const cat = categories[i]
    return {
      ...p,
      title: cat ? `Shop ${cat.name}` : p.title,
      cta: cat ? `Shop ${cat.name}` : "Explore",
      href: cat ? `/products/search?category=${cat.id}` : "/products/search"
    }
  })

  return (
    <section className="container-page mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {promos.map((p) => (
        <Link
          key={p.title}
          href={p.href}
          className={`group relative flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${p.classes} p-5 text-white shadow-card transition-shadow hover:shadow-card-hover`}
        >
          <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15" />
          <div className="relative">
            <h3 className="text-lg font-bold leading-tight">{p.title}</h3>
            <p className="text-sm text-white/85">{p.sub}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold">
              {p.cta} <ArrowRight size={15} className="transition group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      ))}
    </section>
  )
}
