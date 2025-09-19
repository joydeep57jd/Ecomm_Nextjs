import { Metadata } from "next"
// PAGE VIEW COMPONENT
import { ProductSearchPageView } from "pages-sections/product-details/page-view"
// API FUNCTIONS
import { getFilters } from "utils/__api__/product-search"
import { getAllProducts, getOptionsByCategory } from "utils/api/product"

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
    OptionValueIds:string
  }>;
}
// ==============================================================

export default async function ProductSearch({ searchParams }: Props) {
  const { search, page, category, subCategory, subSubCategory,OptionValueIds } = await searchParams
  const categoryId = category ? parseInt(category) : undefined

   const [filters, productsResponse, categoryOptions] = await Promise.all([
    getFilters(),
    getAllProducts({
      ...(search ? { searchCriteria: search } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(subCategory ? { subCategoryId: parseInt(subCategory) } : {}),
      ...(subSubCategory && { subSubCategoryId: parseInt(subSubCategory) }),
      ...(OptionValueIds ? { OptionValueIds } : { OptionValueIds: "" }),
      pageNo: +(page ?? "1"),
      pageSize: 20
    }),
    categoryId ? getOptionsByCategory(categoryId) : Promise.resolve([])
  ])

  const size = productsResponse.pagination.pageSize
  const lastIndex = productsResponse.pagination.pageNumber * productsResponse.pagination.pageSize
  const firstIndex = (productsResponse.pagination.pageNumber - 1) * productsResponse.pagination.pageSize + 1
  const pageCount = Math.ceil(productsResponse.pagination.totalRecords / size)

  return (
    <ProductSearchPageView
      filters={filters}
       categoryOptions={categoryOptions}
      products={productsResponse.dataList}
      pageCount={pageCount}
      totalProducts={productsResponse.pagination.totalRecords}
      lastIndex={productsResponse.dataList.length < size ? firstIndex + productsResponse.dataList.length - 1 : lastIndex}
      firstIndex={firstIndex}
    />
  )
}
