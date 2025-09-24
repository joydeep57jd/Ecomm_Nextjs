import { SlugParams } from "models/Common"
import SingleProduct from "./product"

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
  const variantId = resolvedSearchParams?.variantId ?? ''
  const variant = resolvedSearchParams?.variant ?? ''

  return <SingleProduct slug={slug} variantId={variantId} variant={variant} />
}
