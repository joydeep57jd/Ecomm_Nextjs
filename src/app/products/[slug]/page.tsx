// PAGE VIEW COMPONENT
import { ProductDetailsPageView } from "pages-sections/product-details/page-view"
// API FUNCTIONS
import { getFrequentlyBought, getRelatedProducts } from "utils/__api__/related-products"
// CUSTOM DATA MODEL
import { SlugParams } from "models/Common"
import { getProduct, getVariantOption } from "@/utils/api/product"
import { VariantOption } from "@/models/SingleProduct.model"

// export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
//   const { slug } = await params
//   const product = await api.getProduct(slug)
//   if (!product) notFound()

//   return {
//     title: product.title + " - Bazaar Next.js E-commerce Template",
//     description: "Bazaar is a React Next.js E-commerce template.",
//     authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
//     keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
//   }
// }

export default async function ProductDetails({ params, searchParams }: SlugParams) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams

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

  const variantId = resolvedSearchParams?.variantId
  const variant = resolvedSearchParams?.variant
  const selectedVariant = variant || defaultVariant.slice(0, -1)


  const product = await getProduct({
    itemVariantId: variantId ? Number(variantId) : undefined,
    optionValues: variantId ? "" : selectedVariant
  })

  return (
    <ProductDetailsPageView
      variantMap={variantMap}
      product={product}
      relatedProducts={relatedProducts}
      frequentlyBought={frequentlyBought}
      selectedVariant={selectedVariant}
    />
  )
}
