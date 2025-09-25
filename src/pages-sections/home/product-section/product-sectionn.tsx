"use client"

import Box from "@mui/material/Box"
// GLOBAL CUSTOM COMPONENTS
import Container from "components/Container"
import ProductCard17 from "components/product-cards/product-card-17"
// LOCAL CUSTOM COMPONENTS
import ProductsCarousel from "./products-carousel"
// API FUNCTIONS
import { HomeAPI } from "@/utils/api"
import { Section, SectionItem } from "@/models/Home.model"
import { useEffect, useState } from "react"

export default function ProductSection() {
  const [sections, setSections] = useState<Section[]>([])

  useEffect(() => {
    const getSections = async () => {
      try {
        const { data } = await HomeAPI.homePage()
        setSections(data.responseCompanyTemplateSections)
      } catch (error) {
        console.error("Error fetching sections:", error)
      }
    }
    getSections()
  }, [])

  if (!sections || sections.length === 0) return null




  return (
    <Container>
      {sections.map((section) => {
        const products: SectionItem[] = section.responseSectionItemAndImage?.sectionItems || []

        if (products.length === 0) return null

        return section.sectionName.toLowerCase().includes("banner") ? <></> : (
          <ProductsCarousel
            key={section.companyTemplateSectionId}
            title={section.sectionName || "Products"}
          >
            {products.map((product) => (
              <Box pb={0.6} key={product.itemId}>
                <ProductCard17
                  product={{
                    id: String(product.itemId),
                    slug: product.itemId.toString(),
                    title: product.name,
                    price: product.salePrice || product.price,
                    thumbnail:
                      product.images?.[0]?.fullImagepath || product.imagePath,
                    images: [
                      product.images?.[0]?.fullImagepath,
                      product.images?.[1]?.fullImagepath,
                    ].filter(Boolean) as string[],
                    discount: product.mrp
                      ? Math.round(
                        ((product.mrp - (product.salePrice || product.price)) /
                          product.mrp) *
                        100
                      )
                      : 0,
                    categories: [section.sectionName || "Products"],
                    variantId: 0,
                    stockQty: product.stockQty
                  }}
                />
              </Box>
            ))}
          </ProductsCarousel>
        )
      })}
    </Container>
  )
}