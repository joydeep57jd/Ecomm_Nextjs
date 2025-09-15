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

// ==============================================================
interface Props {
  product: SingleProductResponse;
  variantMap: Map<string, VariantOption[]>
  relatedProducts: Product[];
  frequentlyBought: Product[];
}
// ==============================================================

export default function ProductDetailsPageView(props: Props) {

  const router = useRouter()

  if (!props.product?.variantDetails) {
    router.push("/")
  }

  return (
    <Container className="mt-2 mb-2">
      {/* PRODUCT DETAILS INFO AREA */}
      <ProductIntro product={props.product} variantMap={props.variantMap} />

      {/* PRODUCT DESCRIPTION AND REVIEW */}
      <ProductTabs description={<ProductDescription product={props.product} />} reviews={<ProductReviews />} />

      {/* FREQUENTLY BOUGHT PRODUCTS AREA */}
      {/* <FrequentlyBought products={props.frequentlyBought} /> */}

      {/* AVAILABLE SHOPS AREA */}


      {/* RELATED PRODUCTS AREA */}
      {/* <RelatedProducts products={props.relatedProducts} /> */}
    </Container>
  )
}
