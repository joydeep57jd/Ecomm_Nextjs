import { Metadata } from "next"
// PAGE VIEW COMPONENT
// API FUNCTIONS
import Products from "./products"

export const metadata: Metadata = {
  title: "Product Search - Bazaar Next.js E-commerce Template",
  description:
    "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
}

// ==============================================================
interface Props {
  searchParams: Promise<{
    search: string;
    page: string;
    sort: string;
    category: string;
    subCategory: string;
    subSubCategory: string;
    filter: string
  }>;
}
// ==============================================================

export default async function ProductSearch({ searchParams }: Props) {
  const { search, category, subCategory, subSubCategory, filter } = await searchParams
  const categoryId = category ? parseInt(category) : undefined

  const getFilterValues = () => {
    try {
      const filters = JSON.parse(atob(filter))
      const variants: string[] = []
      Object.keys(filters).forEach(category => {
        const options = filters[category] ?? {}
        Object.keys(options).forEach(key => {
          const value = options[key].join()
          value && variants.push(value)
        })
      })
      return variants.join("#")
    } catch {
      return null
    }
  }

  const filters = getFilterValues()

  return <Products filters={filters} search={search} subCategory={subCategory} subSubCategory={subSubCategory} categoryId={categoryId} />

}
