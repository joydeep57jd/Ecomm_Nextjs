"use client"
import Link from "next/link"
import Button from "@mui/material/Button"
// STYLED COMPONENTS
import { HoverWrapper } from "./styles"
import Product from "@/models/Product.model"
import ProductAction from "@/components/product-action"
import { encodeId } from "@/utils/url-id"

// ========================================================
interface Props {
  product: Product
}
// ========================================================

export default function HoverActions({ product }: Props) {
  return (
    <HoverWrapper className="hover-box">
      <ProductAction
        fullWidth={true}
        product={{
          itemVariantId: product.variantId ?? 0,
          productId: +product.id,
          productImage: product.images[0],
          productName: product.title,
          productPrice: product.price,
          qty: 1,
          stockQty: product.stockQty,
          variantName: product.title,
          mrp: product.price,
          variantOptionDetails: product.variantOptionDetails ?? [],
          isOutOfStock: product.isOutOfStock ?? false
        }}
      />

      <Link
        scroll={false}
        href={`/products/${encodeId(product.id)}${product.variantId ? `?variantId=${encodeId(product.variantId)}` : ""}`}
      >
        <Button
          fullWidth
          disableElevation
          color="inherit"
          variant="contained"
          className="view-btn"
          aria-label="View product"
        >
          View
        </Button>
      </Link>
    </HoverWrapper>
  )
}
