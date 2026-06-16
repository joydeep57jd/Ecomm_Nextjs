import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { type NavCategory } from "./theme"

export function CategoryShowcase({ categories }: { categories: NavCategory[] }) {
  if (!categories.length) return null

  return (
    <section className="container-page mt-8" aria-labelledby="cat-heading">
      <div className="mb-3 flex items-end justify-between">
        <h2 id="cat-heading" className="text-xl font-extrabold text-ink sm:text-2xl">
          Shop by Category
        </h2>
        <Link href="/products/search" className="text-sm font-semibold text-brand-700 hover:text-brand">
          View all
        </Link>
      </div>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))` }}
      >
        {categories.map((c) => {
          const Icon = c.theme.icon
          return (
            <Link
              key={c.id}
              href={`/products/search?category=${c.id}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-line p-4 transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              style={{ background: c.theme.bg }}
            >
              <span
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20"
                style={{ background: c.theme.accent }}
              />
              <div className="relative flex items-center gap-3">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white shadow-sm"
                  style={{ background: c.theme.accent }}
                >
                  <Icon size={22} />
                </span>
                <h3 className="text-base font-bold leading-tight" style={{ color: c.theme.color }}>
                  {c.name}
                </h3>
              </div>

              {c.subCategories.length > 0 && (
                <div className="relative mt-3 flex flex-wrap gap-1.5">
                  {c.subCategories.slice(0, 4).map((s) => (
                    <span
                      key={s.id}
                      className="rounded-full bg-white/80 px-2.5 py-1 text-2xs font-medium text-slate-700"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              )}

              <span
                className="relative mt-4 inline-flex items-center gap-1 text-xs font-semibold"
                style={{ color: c.theme.color }}
              >
                Shop now
                <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
