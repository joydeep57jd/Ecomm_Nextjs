'use client'
import Loading from '@/app/loading'
import Product from '@/models/Product.model'
import { SingleProductResponse, VariantOption } from '@/models/SingleProduct.model'
import { ProductDetailsPageView } from '@/pages-sections/product-details/page-view'
import { getFrequentlyBought, getRelatedProducts } from '@/utils/__api__/related-products'
import { getProduct, getVariantOption } from '@/utils/api/product'
import React, { useEffect, useState } from 'react'

type Props = {
    slug: string
    variantId: string
    variant: string
}

function SingleProduct({ slug, variantId, variant }: Props) {

    const [variantMap, setVariantMap] = useState<Map<string, VariantOption[]>>()
    const [selectedVariant, setSelectedVariant] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [product, setProduct] = useState<SingleProductResponse>()
    const [relatedProducts, setRelatedProducts] = useState<Product[]>()
    const [frequentlyBought, setFrequentlyBought] = useState<Product[]>()

    useEffect(() => {
        if (slug) {
            getInitialData()
        }
    }, [slug])

    useEffect(() => {
        if (variantId || selectedVariant) {
            getProductDetails()
        }
    }, [selectedVariant, variantId])

    useEffect(() => {
        setSelectedVariant(variant)
    }, [variant])


    const getInitialData = async () => {
        const [variantOptions, relatedProducts, frequentlyBought] = await Promise.all([
            getVariantOption(slug),
            getRelatedProducts(),
            getFrequentlyBought()
        ])
        const variantMap = new Map<string, VariantOption[]>()
        let defaultVariant = ""
        variantOptions.forEach((variant) => {
            if (variantMap.has(variant.optionName)) {
                variantMap.get(variant.optionName)!.push(variant)
            } else {
                defaultVariant += variant.variantOptionValueId + ","
                variantMap.set(variant.optionName, [variant])
            }
        })
        setVariantMap(variantMap)
        setSelectedVariant(variant || defaultVariant.slice(0, -1))
        setRelatedProducts(relatedProducts)
        setFrequentlyBought(frequentlyBought)
    }

    const getProductDetails = async () => {
        setIsLoading(true)
        const product = await getProduct({
            itemVariantId: variantId ? Number(variantId) : undefined,
            optionValues: variantId ? "" : selectedVariant
        })
        setProduct(product)
        setIsLoading(false)
    }

    if (!product) return <Loading isSmallLoader={true} />

    return <ProductDetailsPageView
        variantMap={variantMap!}
        isLoading={isLoading}
        product={product!}
        relatedProducts={relatedProducts!}
        frequentlyBought={frequentlyBought!}
        selectedVariant={selectedVariant}
    />

}

export default SingleProduct