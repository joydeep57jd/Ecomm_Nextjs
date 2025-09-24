"use client"
import Loading from "@/app/loading"
import { AllProductResponse, DataList } from "@/models/AllProduct.model"
import { GetCategoryResponse } from "@/models/Category.modal"
import { CategoryWiseFilterResponse } from "@/models/Filters"
import { ProductSearchPageView } from "@/pages-sections/product-details/page-view"
import { getAllProducts, getFilterCategorySection, getOptionsByCategory } from "@/utils/api/product"
import { Box } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"

type Props = {
  filters: string | null
  search: string
  subCategory: string
  subSubCategory: string
  categoryId: number | undefined
}

function Products({ filters, search, subCategory, subSubCategory, categoryId }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [allProductResponse, setAllProductResponse] = useState<AllProductResponse>()
  const [categoryOptions, setCategoryOptions] = useState<GetCategoryResponse[]>()
  const [pageCount, setPageCount] = useState(0)
  const loader = useRef<Element | null>(null)
  const [isLastDataLoaded, setIsLastDataLoaded] = useState(false)

  useEffect(() => {
    fetchData()
  }, [search, page, subCategory, subSubCategory, categoryId])

  useEffect(() => {
    if (page === 1) {
      fetchData()
    } else {
      setPage(1)
    }
  }, [filters])


  useEffect(() => {
    if (!loader?.current) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < pageCount && !isLoading) {
        setIsLoading(true)
        setPage((prev) => prev + 1)
      }
    }, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    })

    observer.observe(loader.current)

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current)
      }
    }
  }, [loader, page, pageCount, isLoading])


  const fetchData = async () => {
    setIsLoading(true)
    const [productsResponse, categoryOptions] = await Promise.all([
      filters
        ? getFilterCategorySection({
          OptionValueIds: filters,
          PageNo: page,
          PageSize: 20
        })
        : getAllProducts({
          ...(search ? { searchCriteria: search } : {}),
          ...(categoryId ? { categoryId } : {}),
          ...(subCategory ? { subCategoryId: parseInt(subCategory) } : {}),
          ...(subSubCategory && { subSubCategoryId: parseInt(subSubCategory) }),
          ...(filters && { optionValueIds: filters }),
          pageNo: page,
          pageSize: 20
        }),
      categoryId ? getOptionsByCategory(categoryId) : Promise.resolve([])
    ])

    if (filters) {
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
          itemVariantId: data.itemVariantId
        })) ?? []
      productsResponse.dataList = dataList
    }

    const size = productsResponse.pagination.pageSize
    const pageCount = Math.ceil(productsResponse.pagination.totalRecords / size)
    setAllProductResponse(prevValue => page === 1 ? productsResponse : { ...prevValue!, dataList: [...(prevValue!.dataList ?? []), ...productsResponse.dataList] })
    setCategoryOptions(categoryOptions)
    setPageCount(pageCount)
    setIsLastDataLoaded(pageCount === page)
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
            top: 0
          }}
        >
          <Loading isSmallLoader={true} />
        </div>
      )}
      {allProductResponse && (
        <>
          <ProductSearchPageView
            categoryOptions={categoryOptions ?? []}
            products={allProductResponse.dataList}
          />
          {
            (pageCount && !isLastDataLoaded) &&
            <Box ref={loader} sx={{ mb: 6 }}>
              <Loading isTiny={true} />
            </Box>
          }
        </>
      )}
    </>
  )
}

export default Products
