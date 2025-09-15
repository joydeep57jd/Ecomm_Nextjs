"use client"
import Link from "next/link"
import { useCallback, useState } from "react"
import Button from "@mui/material/Button"
// STYLED COMPONENTS
import { HoverWrapper } from "./styles"
import Product from "@/models/Product.model"
import { useRouter } from "next/navigation"
import ProductAction from "@/components/product-action"

// ========================================================
interface Props {
  product: Product;
}
// ========================================================

export default function HoverActions({ product }: Props) {
  const router = useRouter()
  const [isQuickViewLoading, setQuickViewLoading] = useState(false)

  const handleNavigate = useCallback(() => {
    setQuickViewLoading(false)
  }, [])

  const handleGoToCart = useCallback(() => {
    router.push("/cart")
  }, [])

  return (
    <HoverWrapper className="hover-box">


      <ProductAction fullWidth={true} product={{
        itemVariantId: product.variantId ?? 0,
        productId: +product.id,
        productImage: product.images[0],
        productName: product.title,
        productPrice: product.price,
        qty: 1,
        stockQty: product.stockQty,
        variantName:product.title,
        mrp:product.price
        

      }} />

      <Link scroll={false} href={`/products/${product.id}`} onNavigate={handleNavigate}>
        <Button
          fullWidth
          disableElevation
          color="inherit"
          variant="contained"
          className="view-btn"
          onClick={handleGoToCart}
          loading={isQuickViewLoading}
          aria-label="Quick view"
        >
          View
        </Button>
      </Link>
    </HoverWrapper>
  )
}
