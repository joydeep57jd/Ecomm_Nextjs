import type { Metadata } from "next"
import { SlugParams } from "models/Common"
import { VariantOption } from "models/SingleProduct.model"
import SingleProduct from "./product"
import { decodeId } from "@/utils/url-id"
import { getVariantOption, getProduct } from "@/utils/api/product"

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeId(slug)

  const variantOptions = await getVariantOption(decodedSlug).catch(() => [] as VariantOption[])

  // Pick the first option value seen per option group — mirrors the default
  // variant selection used when the product page itself first loads.
  const defaultVariantMap = new Map<string, VariantOption>()
  variantOptions.forEach((option) => {
    if (!defaultVariantMap.has(option.optionName)) {
      defaultVariantMap.set(option.optionName, option)
    }
  })
  const defaultVariant = Array.from(defaultVariantMap.values())
    .map((option) => option.variantOptionValueId)
    .join(",")

  const product = defaultVariant
    ? await getProduct({ optionValues: defaultVariant }).catch(() => undefined)
    : undefined

  if (!product?.variantDetails) {
    return { title: "Product - Super Shop" }
  }

  const plainDescription = product.variantDetails.itemDesc?.replace(/<[^>]*>/g, "").trim()

  return {
    title: product.variantDetails.itemName + " - Super Shop",
    description: plainDescription
      ? plainDescription.slice(0, 160)
      : "Super Shop is a React Next.js E-commerce template.",
    authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
    keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
  }
}

export default async function ProductDetails({ params, searchParams }: SlugParams) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const rawVariantId = resolvedSearchParams?.variantId ?? ''
  const variant = resolvedSearchParams?.variant ?? ''

  // URLs carry the ids in encoded (base64) form — decode back to raw ids here.
  const decodedSlug = decodeId(slug)
  const variantId = rawVariantId ? decodeId(String(rawVariantId)) : ''

  return <SingleProduct slug={decodedSlug} variantId={variantId} variant={variant} />
}
