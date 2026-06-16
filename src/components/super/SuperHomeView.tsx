"use client"

import { useEffect, useState } from "react"
import { HomeAPI } from "@/utils/api"
import axiosInstance from "@/utils/axiosInstance"
import { API_URL } from "@/utils/constants"
import { getOfferData } from "@/utils/api/offer"
import { Section, SectionItem } from "@/models/Home.model"
import { BannerOfferResponse } from "@/models/Offer.model"
import { Category } from "@/models/Category.modal"
import Loading from "@/app/loading"
import { HeroCarousel } from "./HeroCarousel"
import { CategoryShowcase } from "./CategoryShowcase"
import { PromoStrip } from "./PromoStrip"
import { ProductRail } from "./ProductRail"
import { ProductCardData } from "./ProductCard"
import { HeroBanner } from "./HeroCarousel"
import { toNavCategories, type NavCategory } from "./theme"

const toCardData = (item: SectionItem, category: string): ProductCardData => ({
  itemId: item.itemId,
  name: item.name,
  price: item.salePrice || item.price,
  mrp: item.mrp || item.price,
  image: item.images?.[0]?.fullImagepath || item.imagePath,
  stockQty: item.stockQty,
  category
})

export default function SuperHomeView() {
  const [rails, setRails] = useState<{ title: string; products: ProductCardData[] }[]>([])
  const [banners, setBanners] = useState<HeroBanner[]>([])
  const [offers, setOffers] = useState<BannerOfferResponse[] | null>(null)
  const [categories, setCategories] = useState<NavCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      const [sectionsRes, offersRes, categoriesRes] = await Promise.allSettled([
        HomeAPI.homePage(),
        getOfferData(),
        axiosInstance.post<{ data: Category[] }>(API_URL.ITEMS.GET_CATEGORY, {})
      ])

      if (!active) return

      if (sectionsRes.status === "fulfilled") {
        const sections: Section[] = sectionsRes.value?.data?.responseCompanyTemplateSections ?? []
        const isBanner = (s: Section) => s.sectionName?.toLowerCase().includes("banner")

        const heroBanners: HeroBanner[] = sections
          .filter(isBanner)
          .flatMap((s) => s.responseSectionItemAndImage?.sectionItems ?? [])
          .map((item) => ({
            image: item.images?.[0]?.fullImagepath || item.imagePath,
            title: item.name
          }))
          .filter((b) => !!b.image)
        setBanners(heroBanners)

        const productRails = sections
          .filter((s) => !isBanner(s))
          .map((s) => ({
            title: s.sectionName || "Products",
            products: (s.responseSectionItemAndImage?.sectionItems ?? []).map((item) =>
              toCardData(item, s.sectionName || "Products")
            )
          }))
          .filter((r) => r.products.length > 0)
        setRails(productRails)
      }

      if (offersRes.status === "fulfilled") setOffers(offersRes.value)

      if (categoriesRes.status === "fulfilled") {
        setCategories(toNavCategories(categoriesRes.value.data?.data ?? []))
      }

      setTimeout(() => active && setIsLoading(false), 300)
    }

    load().catch(() => active && setIsLoading(false))
    return () => {
      active = false
    }
  }, [])

  if (isLoading) return <Loading isSmallLoader={true} />

  const [firstRail, ...restRails] = rails
  const accents = ["#EA580C", "#16A34A", "#9D174D", "#2563EB", "#7C3AED"]

  return (
    <div className="tw-scope">
      <div className="bg-canvas pb-12 text-ink">
        <HeroCarousel banners={banners} offers={offers} categories={categories} />

      <CategoryShowcase categories={categories} />

      {firstRail && (
        <ProductRail
          title={firstRail.title}
          href="/products/search"
          products={firstRail.products}
          accent="#EA580C"
        />
      )}

      <PromoStrip categories={categories} />

      {restRails.map((rail, idx) => (
        <ProductRail
          key={rail.title + idx}
          title={rail.title}
          href="/products/search"
          products={rail.products}
          accent={accents[(idx + 1) % accents.length]}
        />
      ))}
      </div>
    </div>
  )
}
