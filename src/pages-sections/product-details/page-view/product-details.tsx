"use client"

import Container from "@mui/material/Container"
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
import { useState } from "react"

// ==============================================================
interface Props {
  product: SingleProductResponse;
  variantMap: Map<string, VariantOption[]>
  relatedProducts: Product[];
  frequentlyBought: Product[];
  selectedVariant: string
  isLoading: boolean,
  reviews: GetReviewResponse[] 
}
// ==============================================================

export default function ProductDetailsPageView(props: Props) {
  const [activeTab, setActiveTab] = useState(0)
  

  const router = useRouter()

  if (!props.product?.variantDetails) {
    router.push("/")
  }

  return (
    <Container className="mt-2 mb-2">
      {/* PRODUCT DETAILS INFO AREA */}
      <ProductIntro product={props.product} variantMap={props.variantMap} selectedVariant={props.selectedVariant} isLoading={props.isLoading}  onShowReviews={() => setActiveTab(1)} />

      {/* PRODUCT DESCRIPTION AND REVIEW */}
      <ProductTabs description={<ProductDescription product={props.product} />}   reviews={<ProductReviews reviews={props.reviews} />}  activeTab={activeTab}
        onTabChange={setActiveTab}/>

      {/* FREQUENTLY BOUGHT PRODUCTS AREA */}
      {/* <FrequentlyBought products={props.frequentlyBought} /> */}

      {/* AVAILABLE SHOPS AREA */}


      {/* RELATED PRODUCTS AREA */}
      {/* <RelatedProducts products={props.relatedProducts} /> */}
    </Container>
  )
}
