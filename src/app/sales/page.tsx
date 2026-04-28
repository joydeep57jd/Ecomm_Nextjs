import OfferListPageView from "@/pages-sections/sales/page-view/offer-list"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Offers & Sales",
  description: "Browse all active offers and promotions"
}

export default function SalesPage() {
  return <OfferListPageView />
}
