'use client'
import Loading from '@/app/loading'
import { AllProductResponse, DataList } from '@/models/AllProduct.model'
import { GetCategoryResponse } from '@/models/Category.modal'
import { CategoryWiseFilterResponse } from '@/models/Filters'
import { ProductSearchPageView } from '@/pages-sections/product-details/page-view'
import { getAllProducts, getFilterCategorySection, getOptionsByCategory } from '@/utils/api/product'
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
            filters ? getFilterCategorySection({
                OptionValueIds: filters,
                PageNo: +(page ?? "1"),
                PageSize: 20
            }) : getAllProducts({
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

        if (filters) {
            const dataList: DataList[] = (productsResponse as CategoryWiseFilterResponse).variantDetails?.map(data => ({
                categoryId: data.categoryId,
                id: data.id,
                imageList: data.imageList,
                isSoldOut: data.isSoldOut,
                itemCode: data.itemCode,
                itemDesc: data.itemDesc,
                itemId: data.itemId,
                itemName: data.itemName,
                memberPrice: data.batchInfos?.[0]?.memberPrice,
                mrp: data.batchInfos?.[0]?.mrp,
                savePrice: data.batchInfos?.[0]?.savePrice,
                savePricePctg: data.batchInfos?.[0]?.savePricePctg,
                subCategoryId: data.subCategoryId,
            })) ?? []
            productsResponse.dataList = dataList
        }

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