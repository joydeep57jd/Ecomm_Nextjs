import { SlugParams } from "models/Common"
import SingleProduct from "./product"
import { decodeId } from "@/utils/url-id"

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
  const rawVariantId = resolvedSearchParams?.variantId ?? ''
  const variant = resolvedSearchParams?.variant ?? ''

  // URLs carry the ids in encoded (base64) form — decode back to raw ids here.
  const decodedSlug = decodeId(slug)
  const variantId = rawVariantId ? decodeId(String(rawVariantId)) : ''

  return <SingleProduct slug={decodedSlug} variantId={variantId} variant={variant} />
}
