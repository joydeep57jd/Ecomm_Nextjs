import OfferProductsPageView from "@/pages-sections/sales/page-view/offer-products"
import { getOfferData } from "@/utils/api/offer"
import type { Metadata } from "next"


export const metadata: Metadata = {
  title: "Sales 1 - Bazaar Next.js E-commerce Template",
  description:
    "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
}

// ==============================================================
interface Props {
  params: Promise<{ slug: string }>
}
// ==============================================================

export default async function SalesOne({ params }: Props) {
  const { slug } = await params
  const decoded = Buffer.from(decodeURIComponent(slug), "base64").toString("utf-8")
  const offerId = +decoded

  if (!offerId || isNaN(offerId)) {
    return <div>Invalid offer</div>
  }

  // get offer name from offer list
  const offers = await getOfferData()
  const offer = offers?.find((o) => o.offerId === offerId)

  return <OfferProductsPageView offerId={offerId} offerName={offer?.offerName ?? "Offer Products"} />
}
