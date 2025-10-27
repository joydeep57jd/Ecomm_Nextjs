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
const enum sortField {
  RELEVANCE = "relevance",
  DATE = "date",
  PRICE_LOW_TO_HIGH = "price-low-to-high",
  PRICE_HIGH_TO_LOW = "price-high-to-low"
}
// ==============================================================
interface Props {
  searchParams: Promise<{
    search: string
    page: string
    sort: sortField
    category: string
    subCategory: string
    subSubCategory: string
    filter: string
    variantFilter: string
    price: string
  }>
}
// ==============================================================

export default async function ProductSearch({ searchParams }: Props) {
  const { search, category, subCategory, subSubCategory, filter, variantFilter, sort, price } =
    await searchParams

  const sortFieldValue = {
    [sortField.RELEVANCE]: true,
    [sortField.DATE]: true,
    [sortField.PRICE_LOW_TO_HIGH]: false,
    [sortField.PRICE_HIGH_TO_LOW]: true
  }

  const sortFieldKey = {
    [sortField.RELEVANCE]: "RelevanceFilter",
    [sortField.DATE]: "DateFilter",
    [sortField.PRICE_LOW_TO_HIGH]: "PriceFilter",
    [sortField.PRICE_HIGH_TO_LOW]: "PriceFilter"
  }

  const getFilterValues = (encodedFilters: string) => {
    try {
      const filters = JSON.parse(atob(encodedFilters))
      const variants: string[] = []
      const keyNames: string[] = []
      Object.keys(filters).forEach((category) => {
        const options = filters[category] ?? {}
        Object.keys(options).forEach((key) => {
          const value = options[key].join()
          if (value) {
            variants.push(value)
            keyNames.push(key)
          }
        })
      })
      return { name: keyNames, value: variants.join("#") }
    } catch {
      return { name: [], value: "" }
    }
  }

  const getSortFilter = () => {
    const field =
      (Object.keys(sortFieldValue).find((key) => key === sort) as sortField) ?? sortField.RELEVANCE
    return field ? { [sortFieldKey[field]]: sortFieldValue[field] } : {}
  }

  const getPriceFilter = (): Record<string, number> => {
    if (!price) return {}
    const priceArray = JSON.parse(atob(price))
    if (priceArray.length > 1) return { MinPrice: priceArray[0], MaxPrice: priceArray[1] }
    return {}
  }

  const filters = getFilterValues(filter)
  const variantFilters = getFilterValues(variantFilter)
  const sortFilters = getSortFilter()
  const priceFilters = getPriceFilter()

  return (
    <Products
      filters={filters.value}
      search={search ?? ""}
      subCategory={subCategory ?? ""}
      subSubCategory={subSubCategory ?? ""}
      categoryId={category ?? ""}
      variantFilters={variantFilters.value}
      sortFilters={sortFilters}
      priceFilters={priceFilters}
      badges={[...filters.name, ...variantFilters.name]}
    />
  )
}
