"use client"
import Loading from "@/app/loading"
import { AllProductResponse, DataList } from "@/models/AllProduct.model"
import { GetCategoryResponse } from "@/models/Category.modal"
import { CategoryWiseFilterResponse, VariantOptionDetails } from "@/models/Filters"
import { ProductSearchPageView } from "@/pages-sections/product-details/page-view"
import { getAllProducts, getFilterCategorySection, getOptionsByCategory } from "@/utils/api/product"
import { Box } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"

type Props = {
  filters: string
  search: string
  subCategory: string
  subSubCategory: string
  categoryId: string
  variantFilters: string
  badges: string[]
  sortFilters: Record<string, boolean>
  priceFilters: Record<string, number>
}

function Products({
  filters,
  search,
  subCategory,
  subSubCategory,
  categoryId,
  variantFilters,
  badges,
  sortFilters,
  priceFilters
}: Props) {
  let loadingCriteria = ""
  let loadingCategory = ""
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [allProductResponse, setAllProductResponse] = useState<AllProductResponse>()
  const [categoryOptions, setCategoryOptions] = useState<GetCategoryResponse[]>()
  const [pageCount, setPageCount] = useState(0)
  const [isLastDataLoaded, setIsLastDataLoaded] = useState(false)
  const [variantOptions, setVariantOptions] = useState<VariantOptionDetails[]>([])
  const loader = useRef<Element | null>(null)
  const [currentBadges, setCurrentBadges] = useState<string[]>([])

  useEffect(() => {
    if (loadingCriteria === getLoadingCriteria()) return
    fetchData()
  }, [search, page, subCategory, subSubCategory, categoryId])

  useEffect(() => {
    if (!allProductResponse) return
    if (loadingCriteria === getLoadingCriteria()) return
    if (page === 1) {
      fetchData()
    } else {
      setPage(1)
    }
  }, [filters, variantFilters, sortFilters, priceFilters])

  useEffect(() => {
    if (!categoryId && categoryOptions) {
      setCategoryOptions([])
    }
    if (loadingCategory === categoryId) return
    if (categoryId) {
      fatchFilterOption()
    } else {
      setCategoryOptions([])
    }
  }, [categoryId])

  useEffect(() => {
    if (!loader?.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < pageCount && !isLoading) {
          setIsLoading(true)
          setPage((prev) => prev + 1)
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }
    )

    observer.observe(loader.current)

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current)
      }
    }
  }, [loader, page, pageCount, isLoading])

  const fatchFilterOption = async () => {
    loadingCategory = categoryId
    const data = await getOptionsByCategory(+categoryId!)
    setCategoryOptions(data)
  }

  const getLoadingCriteria = () => `${search}-${categoryId}-${subCategory}-${subSubCategory}-${filters}-`

  const fetchData = async () => {
    setIsLoading(true)
    loadingCriteria = getLoadingCriteria()
    const [productsResponse] = await Promise.all([
      (filters || variantFilters)
        ? getFilterCategorySection({
          OptionValueIds: filters || "",
          PageNo: page,
          PageSize: 18,
          ItemOptionValueIds: variantFilters || "",
          ...sortFilters,
          ...priceFilters
        })
        : getAllProducts({
          ...(search ? { searchCriteria: search } : {}),
          ...(categoryId ? { categoryId: +categoryId } : {}),
          ...(subCategory ? { subCategoryId: parseInt(subCategory) } : {}),
          ...(subSubCategory && { subSubCategoryId: parseInt(subSubCategory) }),
          ...(filters && { optionValueIds: filters }),
          pageNo: page,
          pageSize: 18,
          ...sortFilters,
          ...priceFilters
        })
    ])

    if (filters || variantFilters) {
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
          savePrice: data.batchInfos?.[0]?.savePrice,
          savePricePctg: data.batchInfos?.[0]?.savePricePctg,
          subCategoryId: data.subCategoryId,
          itemVariantId: data.itemVariantId,
          bisnessUnitId: data.businessUnitId,
          unitName: data?.unitName,
          fontColor: data.fontColor,
          backgroundColor: data.backgroundColor
        })) ?? []
      productsResponse.dataList = dataList
      setVariantOptions((productsResponse as CategoryWiseFilterResponse).variantOptionDetails)
    }

    console.warn(productsResponse, "productsResponsefthrth")

    const size = productsResponse.pagination.pageSize
    const pageCount = Math.ceil(productsResponse.pagination.totalRecords / size)
    setAllProductResponse((prevValue) =>
      page === 1
        ? productsResponse
        : {
          ...prevValue!,
          dataList: [...(prevValue!.dataList ?? []), ...productsResponse.dataList]
        }
    )

    setPageCount(pageCount)
    setIsLastDataLoaded(pageCount === page)
    setCurrentBadges([...badges])
    setIsLoading(false)
  }

  return (
    <>
      {!allProductResponse && isLoading && <Loading isSmallLoader={true} />}
      {isLoading && allProductResponse && (
        <div
          style={{
            position: "absolute",
            zIndex: 9,
            width: "100%",
          }}
        >
          <Loading isTiny={true} />
        </div>
      )}
      {allProductResponse && (
        <>
          <ProductSearchPageView
            categoryOptions={categoryOptions ?? []}
            products={allProductResponse.dataList}
            variantOptions={variantOptions}
            badges={currentBadges}
            priceFilters={priceFilters}
          />
          {pageCount && !isLastDataLoaded && (
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
