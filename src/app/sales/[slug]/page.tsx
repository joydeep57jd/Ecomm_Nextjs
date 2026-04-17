import OfferProductsPageView from "@/pages-sections/sales/page-view/offer-products"
import { getOfferData } from "@/utils/api/offer"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function SalesWithCategoryPage({ params }: Props) {
  const { slug } = await params
  const decoded = Buffer.from(decodeURIComponent(slug), "base64").toString("utf-8")
  const offerId = +decoded

  if (!offerId || isNaN(offerId)) {
    return <div>Invalid offer</div>
  }

  // get offer name from offer list
  const offers = await getOfferData()
  const offer = offers?.find((o) => o.offerId === offerId)

  return (
    <OfferProductsPageView offerId={offerId} offerName={offer?.offerName ?? "Offer Products"} />
  )
}
