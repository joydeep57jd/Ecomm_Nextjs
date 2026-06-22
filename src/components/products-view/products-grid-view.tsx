"use client"
import Box from "@mui/material/Box"
// GLOBAL CUSTOM COMPONENTS
import ProductCard17 from "components/product-cards/product-card-17"
import { DataList } from "@/models/AllProduct.model"
import { VariantOptionDetails } from "@/models/Filters.models"
import { Product } from "@/models/Home.model"

// ========================================================
type Props = { products: DataList[]; variantOptions: VariantOptionDetails[]; badges: string[] }
// ========================================================

const FALLBACK_IMAGE = "/assets/images/products/no-photo.png"

const mapToProduct = (product: DataList): Product => {
  const mrp = product.mrp
  const price = product.discountedPrice ?? product.mrp
  const thumbnail = product.imageList?.[0]?.fullImagepath || FALLBACK_IMAGE

  return {
    id: String(product.itemId),
    slug: String(product.itemId),
    title: product.itemName,
    price,
    mrp,
    thumbnail,
    images: product.imageList?.map((img) => img.fullImagepath).filter(Boolean) ?? [],
    discount: product.savePricePctg || 0,
    categories: [],
    businessUnitName: product.unitName,
    businessUnitId: product.businessUnitId ? +product.businessUnitId : undefined,
    variantId: product.itemVariantId ?? product.variantId,
    itemVariantId: product.itemVariantId ?? product.variantId,
    stockQty: product.stockQty,
    rating: product.itemRating,
    reviewCount: product.reviewCount,
    fontColor: product.fontColor,
    backgroundColor: product.backgroundColor
  }
}

export default function ProductsGridView({ products }: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" },
        gap: 1.5
      }}
    >
      {products?.map((product) => (
        <ProductCard17
          key={product.itemVariantId ?? product.variantId ?? product.id}
          product={mapToProduct(product)}
        />
      ))}
    </Box>
  )
}
