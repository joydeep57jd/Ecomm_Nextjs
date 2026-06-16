"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search } from "lucide-react"

export function SearchBar() {
  const router = useRouter()
  const [q, setQ] = useState("")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    router.push(term ? `/products/search?search=${encodeURIComponent(term)}` : "/products/search")
  }

  return (
    <form onSubmit={submit} role="search" className="relative w-full">
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        type="search"
        placeholder="Search for products, brands and more"
        aria-label="Search products"
        className="h-10 w-full rounded-xl border border-line bg-slate-50 pl-10 pr-20 text-sm text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand-100"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700"
      >
        Search
      </button>
    </form>
  )
}
