'use client'
import Loading from '@/app/loading'
import { AllProductResponse } from '@/models/AllProduct.model'
import { GetCategoryResponse } from '@/models/Category.modal'
import { ProductSearchPageView } from '@/pages-sections/product-details/page-view'
import { getAllProducts, getOptionsByCategory } from '@/utils/api/product'
import React, { useEffect, useState } from 'react'

type Props = {
    filters: string | null
    search: string
    page: string
    subCategory: string
    subSubCategory: string
    categoryId: number | undefined
}

function Products({ filters,
    search,
    page,
    subCategory,
    subSubCategory,
    categoryId }: Props) {

    const [isLoading, setIsLoading] = useState(false)
    const [allProductResponse, setAllProductResponse] = useState<AllProductResponse>()
    const [categoryOptions, setCategoryOptions] = useState<GetCategoryResponse[]>()
    const [size, setSize] = useState(0)
    const [firstIndex, setFirstIndex] = useState(0)
    const [lastIndex, setLastIndex] = useState(0)
    const [pageCount, setPageCount] = useState(0)

    useEffect(() => {
        fetchData()
    }, [
        filters,
        search,
        page,
        subCategory,
        subSubCategory,
        categoryId
    ])


    const fetchData = async () => {
        setIsLoading(true)
        const [productsResponse, categoryOptions] = await Promise.all([
            getAllProducts({
                ...(search ? { searchCriteria: search } : {}),
                ...(categoryId ? { categoryId } : {}),
                ...(subCategory ? { subCategoryId: parseInt(subCategory) } : {}),
                ...(subSubCategory && { subSubCategoryId: parseInt(subSubCategory) }),
                ...(filters && { optionValueIds: filters }),
                pageNo: +(page ?? "1"),
                pageSize: 20
            }),
            categoryId ? getOptionsByCategory(categoryId) : Promise.resolve([])
        ])

        const size = productsResponse.pagination.pageSize
        const lastIndex = productsResponse.pagination.pageNumber * productsResponse.pagination.pageSize
        const firstIndex = (productsResponse.pagination.pageNumber - 1) * productsResponse.pagination.pageSize + 1
        const pageCount = Math.ceil(productsResponse.pagination.totalRecords / size)
        setSize(size)
        setAllProductResponse(productsResponse)
        setCategoryOptions(categoryOptions)
        setPageCount(pageCount)
        setLastIndex(lastIndex)
        setFirstIndex(firstIndex)
        setIsLoading(false)
    }

    return (
        <>
            {
                !allProductResponse && isLoading && <Loading isSmallLoader={true} />
            }
            {isLoading && allProductResponse && <div style={{
                position: 'absolute',
                zIndex: 9,
                width: '100%',
                top: 0
            }}>
                <Loading isSmallLoader={true} />
            </div>}
            {
                allProductResponse &&
                <ProductSearchPageView
                    categoryOptions={categoryOptions ?? []}
                    products={allProductResponse.dataList}
                    pageCount={pageCount}
                    totalProducts={allProductResponse.pagination.totalRecords}
                    lastIndex={allProductResponse.dataList.length < size ? firstIndex + allProductResponse.dataList.length - 1 : lastIndex}
                    firstIndex={firstIndex}
                />
            }
        </>
    )
}

export default Products