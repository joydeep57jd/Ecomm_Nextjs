"use client"

import { Fragment, useEffect, useState } from "react"
// LOCAL CUSTOM COMPONENTS

import { Section } from "@/models/Home.model"
import { HomeAPI } from "@/utils/api"
import ProductSection from "../product-section"
import Section9 from "../section-9"
import HeroSection from "../hero-section"
import Loading from "@/app/loading"

export default function HomePageView() {
  const [productSections, setProductSections] = useState<Section[]>([])
  const [bannerSections, setBannerSections] = useState<Section[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getSections()
  }, [])

  const getSections = async () => {
    try {
      const { data } = await HomeAPI.homePage()
      const productSections = data.responseCompanyTemplateSections.filter(
        (section: Section) => !section.sectionName.toLowerCase().includes("banner")
      )
      const bannerSections = data.responseCompanyTemplateSections.filter((section: Section) =>
        section.sectionName.toLowerCase().includes("banner")
      )
      setProductSections(productSections)
      setBannerSections(bannerSections)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    } catch (error) {
      console.error("Error fetching sections:", error)
    } finally {
      // console.warn(productSections, bannerSections)
    }
  }

  return (
    isLoading ? <Loading isSmallLoader={true} /> :
      <Fragment>
        <HeroSection bannerSection={bannerSections} />
        <ProductSection sections={productSections} />
        <Section9 />

        {/* <Newsletter /> */}
      </Fragment>
  )
}
