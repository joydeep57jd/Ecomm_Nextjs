import { Metadata } from "next"
// PAGE VIEW COMPONENT
import { ProductSearchPageView } from "pages-sections/product-details/page-view"
// API FUNCTIONS
import { getFilters } from "utils/__api__/product-search"
import { getAllProducts } from "utils/api/product"

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
  }>;
}
// ==============================================================

export default async function ProductSearch({ searchParams }: Props) {
  const { search, page, category, subCategory, } = await searchParams

  const [filters, productsResponse] = await Promise.all([
    getFilters(),
    getAllProducts({
      ...(search ? { searchCriteria: search } : {}),
      ...(category ? { categoryId: parseInt(category) } : {}),
      ...(subCategory ? { subCategoryId: parseInt(subCategory) } : {}),
      pageNo: +(page ?? "1"),
      pageSize: 20,
    })
  ])

  const size = productsResponse.pagination.pageSize
  const lastIndex = productsResponse.pagination.pageNumber * productsResponse.pagination.pageSize
  const firstIndex = (productsResponse.pagination.pageNumber - 1) * productsResponse.pagination.pageSize + 1
  const pageCount = Math.ceil(productsResponse.pagination.totalRecords / size)

  return (
    <ProductSearchPageView
      filters={filters}
      products={productsResponse.dataList}
      pageCount={pageCount}
      totalProducts={productsResponse.pagination.totalRecords}
      lastIndex={productsResponse.dataList.length < size ? firstIndex + productsResponse.dataList.length - 1 : lastIndex}
      firstIndex={firstIndex}
    />
  )
}
