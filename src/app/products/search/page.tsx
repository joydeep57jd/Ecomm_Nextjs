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
  const { search, page, category, subCategory, subSubCategory, filter } = await searchParams
  const categoryId = category ? parseInt(category) : undefined

  const getFilterValues = () => {
    try {
      const filters = JSON.parse(atob(filter))
      const varints = Object.keys(filters).reduce((acc: number[], key: string) => {
        return [...acc, ...filters[key]]
      }, []).join("#")
      console.warn(varints)
      return varints
    } catch {
      return null
    }
  }

  const filters = getFilterValues()

  return <Products filters={filters} search={search} page={page} subCategory={subCategory} subSubCategory={subSubCategory} categoryId={categoryId} />

}
