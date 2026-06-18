"use client"
import Loading from "@/app/loading"
import { AllProductResponse, DataList } from "@/models/AllProduct.model"
import { GetCategoryResponse } from "@/models/Category.modal"
import { CategoryWiseFilterResponse, VariantOptionDetails } from "@/models/Filters.models"
import { ProductSearchPageView } from "@/pages-sections/product-details/page-view"
import { getAllProducts, getFilterCategorySection, getOptionsByCategory } from "@/utils/api/product"
import { Box } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"

type Props = {
  filters: string
  search: string
  subCategory: string
  SubCategory: string
  categoryId: string
  variantFilters: string
  badges: string[]
  sortFilters: Record<string, boolean>
  priceFilters: Record<string, number>
  brandFilters: string
}

function Products({
  filters,
  search,
  subCategory,
  SubCategory,
  categoryId,
  variantFilters,
  badges,
  sortFilters,
  priceFilters,
  brandFilters
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [allProductResponse, setAllProductResponse] = useState<AllProductResponse>()
  const [categoryOptions, setCategoryOptions] = useState<GetCategoryResponse[]>([])
  const [pageCount, setPageCount] = useState(0)
  const [isLastDataLoaded, setIsLastDataLoaded] = useState(false)
  const [variantOptions, setVariantOptions] = useState<VariantOptionDetails[]>([])
  const loader = useRef<Element | null>(null)
  const [currentBadges, setCurrentBadges] = useState<string[]>([])

  // Ref-based guards that survive re-renders (plain `let` resets to "" every render)
  const isLoadingRef = useRef(false)
  const loadingCriteriaRef = useRef("")
  const loadingCategoryRef = useRef("")

  // Tracks the "navigation identity": category + search + subcategory.
  // When this changes the user navigated to a new dataset — we must reset
  // page to 1 and replace (not append) the product list.
  const lastNavKeyRef = useRef<string | undefined>(undefined)

  const getNavKey = () =>
    `${search}|${categoryId}|${subCategory}|${SubCategory}`

  // Criteria includes the page number so infinite-scroll pages deduplicate correctly.
  const getLoadingCriteria = (p: number) =>
    `${search}|${categoryId}|${subCategory}|${SubCategory}|${filters}|${variantFilters}|${brandFilters}|p${p}`

  // ─── Core fetch ────────────────────────────────────────────────────────────

  const fetchData = async (pageToFetch: number) => {
    // Prevent concurrent fetches
    if (isLoadingRef.current) return
    // Prevent re-fetching the exact same page + criteria
    const criteria = getLoadingCriteria(pageToFetch)
    if (loadingCriteriaRef.current === criteria) return

    isLoadingRef.current = true
    loadingCriteriaRef.current = criteria
    setIsLoading(true)

    try {
      const productsResponse = await (
        filters || variantFilters || brandFilters
          ? getFilterCategorySection({
              OptionValueIds: [filters, variantFilters].filter(Boolean).join("#") || "",
              PageNo: pageToFetch,
              PageSize: 16,
              ItemOptionValueIds: "",
              SubCategoryId: +subCategory || +SubCategory || null,
              ...(brandFilters ? { BrandId: brandFilters } : {}),
              ...sortFilters,
              ...priceFilters
            })
          : getAllProducts({
              ...(search ? { searchCriteria: search } : {}),
              ...(categoryId ? { categoryId: +categoryId } : {}),
              ...(subCategory ? { subCategoryId: parseInt(subCategory) } : {}),
              ...(SubCategory && { SubCategoryId: parseInt(SubCategory) }),
              ...(filters && { optionValueIds: filters }),
              pageNo: pageToFetch,
              pageSize: 16,
              ...sortFilters,
              ...priceFilters
            })
      )

      if (filters || variantFilters || brandFilters) {
        const dataList: DataList[] =
          (productsResponse as CategoryWiseFilterResponse).variantDetails?.map((data) => ({
            categoryId: data.categoryId,
            id: data.id,
            imageList: data.imageList,
            isSoldOut: data.isSoldOut,
            itemCode: data.itemCode,
            itemDesc: data.itemDesc,
            itemId: data.itemId,
            itemName: data.variantName,
            memberPrice: data.batchInfos?.[0]?.memberPrice,
            mrp: data.batchInfos?.[0]?.mrp,
            discountedPrice: data.batchInfos?.[0]?.salePrice,
            savePrice: data.batchInfos?.[0]?.savePrice,
            savePricePctg: data.batchInfos?.[0]?.savePricePctg,
            stockQty: data.isSoldOut ? 0 : (data.batchInfos?.[0]?.stockQty ?? 0),
            subCategoryId: data.subCategoryId,
            itemVariantId: data.itemVariantId,
            businessUnitId: data.businessUnitId,
            unitName: data.unitName,
            fontColor: data.fontColor,
            backgroundColor: data.backgroundColor,
            itemRating: data.itemRating ?? 0,
            reviewCount: 0
          })) ?? []
        productsResponse.dataList = dataList
        setVariantOptions((productsResponse as CategoryWiseFilterResponse).variantOptionDetails)
      }

      const size = productsResponse.pagination.pageSize
      const totalPages = Math.ceil(productsResponse.pagination.totalRecords / size)

      setAllProductResponse((prev) =>
        // pageToFetch=1 → replace (new context or filter reset); >1 → append (infinite scroll)
        pageToFetch === 1
          ? productsResponse
          : { ...prev!, dataList: [...(prev!.dataList ?? []), ...(productsResponse.dataList ?? [])] }
      )
      setPageCount(totalPages)
      setIsLastDataLoaded(totalPages === pageToFetch)
      setCurrentBadges([...badges])
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }

  // ─── Effect 1: navigation context + infinite-scroll page increments ────────
  //
  // Fires when category / search / subcategory / page changes.
  // If the "navigation identity" changed (e.g. Garments → Grocery) we must
  // clear stale data and force page 1 regardless of what page state holds.
  // If only `page` changed (infinite scroll) we fetch that specific page.

  useEffect(() => {
    const navKey = getNavKey()
    const navChanged =
      lastNavKeyRef.current !== undefined && lastNavKeyRef.current !== navKey
    lastNavKeyRef.current = navKey

    if (navChanged) {
      // Tear down previous context immediately so the user never sees stale data
      setAllProductResponse(undefined)
      setPageCount(0)
      setIsLastDataLoaded(false)
      setIsLoading(false)
      isLoadingRef.current = false
      loadingCriteriaRef.current = ""
      // Always show page 1 for the new category/search
      setPage(1)
      fetchData(1)
    } else {
      fetchData(page)
    }
  }, [search, page, subCategory, SubCategory, categoryId])

  // ─── Effect 2: filter / sort / price / brand changes ───────────────────────
  //
  // Always fetches from page 1. If the current page is already 1 we call
  // fetchData directly; otherwise setPage(1) triggers Effect 1 above which
  // then calls fetchData(1).

  useEffect(() => {
    if (!allProductResponse) return
    // Invalidate cached criteria so the guard in fetchData lets the call through
    loadingCriteriaRef.current = ""
    if (page === 1) {
      fetchData(1)
    } else {
      setPage(1)
    }
  }, [filters, variantFilters, JSON.stringify(sortFilters), JSON.stringify(priceFilters), brandFilters])

  // ─── Effect 3: category options (filter sidebar) ───────────────────────────

  useEffect(() => {
    const id = categoryId || subCategory || SubCategory
    if (!id) {
      setCategoryOptions([])
      return
    }
    if (loadingCategoryRef.current === id) return
    fetchFilterOption(id)
  }, [categoryId, subCategory, SubCategory])

  // ─── Effect 4: IntersectionObserver for infinite scroll ───────────────────

  useEffect(() => {
    if (!loader?.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        // Use both the state value (captured in closure) and the ref (always
        // current) to prevent double-firing without blocking fetchData itself.
        if (entries[0].isIntersecting && page < pageCount && !isLoading && !isLoadingRef.current) {
          setPage((prev) => prev + 1)
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    )
    observer.observe(loader.current)
    return () => {
      if (loader.current) observer.unobserve(loader.current)
    }
  }, [loader, page, pageCount, isLoading])

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const fetchFilterOption = async (id: string) => {
    loadingCategoryRef.current = id
    const isCategoryId = !!categoryId
    const data = await getOptionsByCategory(isCategoryId ? +id : null, isCategoryId ? null : +id)
    setCategoryOptions(data?.variantOptions?.map((opt) => ({ ...opt, brands: data.brands })) ?? [])
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Full-page loader: shown only when there is no data yet */}
      {!allProductResponse && isLoading && <Loading isSmallLoader={true} />}

      {/* Slim top bar: shown when loading additional pages over existing data */}
      {isLoading && allProductResponse && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1600 }}>
          <Loading isTiny={true} />
        </div>
      )}

      {allProductResponse && (
        <>
          <ProductSearchPageView
            categoryOptions={categoryOptions}
            products={allProductResponse.dataList}
            variantOptions={variantOptions}
            badges={currentBadges}
            priceFilters={priceFilters}
            totalRecords={allProductResponse.pagination?.totalRecords}
          />
          {!!pageCount && !isLastDataLoaded && (
            <Box ref={loader} sx={{ mb: 6 }}>
              <Loading isTiny={true} />
            </Box>
          )}
        </>
      )}
    </>
  )
}

export default Products
