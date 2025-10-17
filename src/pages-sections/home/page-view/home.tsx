"use client"

import { Fragment, useEffect, useState } from "react"
// LOCAL CUSTOM COMPONENTS

import Section9 from "../section-9"
import HeroSection from "../hero-section"
import ProductSection from "../product-section"
import { Section } from "@/models/Home.model"
import { HomeAPI } from "@/utils/api"

export default function HomePageView() {
  const [productSections, setProductSections] = useState<Section[]>([])
  const [bannerSections, setBannerSections] = useState<Section[]>([])

  useEffect(() => {
    console.warn("HomePageView rendered")

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
    } catch (error) {
      console.error("Error fetching sections:", error)
    }
  }

  return (
    <Fragment>
      {/* HERO SLIDER SECTION */}
      {/* <HeroSection bannerSection={bannerSections} /> */}

      {/* FLASH DEALS SECTION */}
      {/* <ProductSection sections={productSections} /> */}

      {/* CUSTOM SOLUTIONS SECTION */}

      {/* SERVICES SECTION */}
      {/* <Section9 /> */}

      {/* POPUP NEWSLETTER FORM */}
      {/* <Newsletter /> */}
    </Fragment>
  )
}
