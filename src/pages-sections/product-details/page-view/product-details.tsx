"use client"

import Container from "@mui/material/Container"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import { IconButton, Box } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
// LOCAL CUSTOM COMPONENTS
import ProductTabs from "../product-tabs"
import ProductIntro from "../product-intro"
import ProductReviews from "../product-reviews"
import ProductDescription from "../product-description"
// CUSTOM DATA MODEL
import Product from "models/Product.model"
import { SingleProductResponse, VariantOption } from "@/models/SingleProduct.model"
import { useRouter } from "next/navigation"
import { GetReviewResponse } from "@/models/Rating.model"
import { useEffect, useState } from "react"
import ProductSpecification from "../product-specification"

// ==============================================================
interface Props {
  product: SingleProductResponse
  variantMap: Map<string, VariantOption[]>
  relatedProducts: Product[]
  frequentlyBought: Product[]
  selectedVariant: string
  isLoading: boolean
  reviews: GetReviewResponse[]
}
// ==============================================================

export default function ProductDetailsPageView(props: Props) {
  const [activeTab, setActiveTab] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (!props.product?.variantDetails) {
      router.push("/")
    }
  }, [props.product?.variantDetails])

  const onShowReviews = () => {
    setActiveTab(1)
    setTimeout(() => {
      const reviewSection = document.getElementById("reviews-container")
      if (reviewSection) {
        reviewSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  return (
    <Container className="mt-2 mb-2">
      {/* BREADCRUMB + BACK */}
      <Box display="flex" alignItems="center" mb={2} gap={0.5}>
        <IconButton onClick={() => router.back()} aria-label="Go Back" size="small">
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="inherit" sx={{ fontSize: 14 }} />} aria-label="breadcrumb">
          <Link href="/" underline="hover" sx={{ fontSize: 13, color: "text.secondary" }}>
            Home
          </Link>
          <Typography sx={{ fontSize: 13, color: "text.primary", fontWeight: 500 }}>
            {props.product.variantDetails?.variantName}
          </Typography>
        </Breadcrumbs>
      </Box>
      <ProductIntro
        product={props.product}
        variantMap={props.variantMap}
        selectedVariant={props.selectedVariant}
        isLoading={props.isLoading}
        onShowReviews={onShowReviews}
      />

      {/* PRODUCT DESCRIPTION AND REVIEW */}
      <ProductTabs
        description={<ProductDescription product={props.product} />}
        reviews={<ProductReviews reviews={props.reviews} />}
        specifications={<ProductSpecification specifications={props.product?.variantOptionList} />}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* FREQUENTLY BOUGHT PRODUCTS AREA */}
      {/* <FrequentlyBought products={props.frequentlyBought} /> */}

      {/* AVAILABLE SHOPS AREA */}

      {/* RELATED PRODUCTS AREA */}
      {/* <RelatedProducts products={props.relatedProducts} /> */}
    </Container>
  )
}
