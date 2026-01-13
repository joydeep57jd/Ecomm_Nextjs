"use client"
import Link from "next/link"
import Rating from "@mui/material/Rating"
import Typography from "@mui/material/Typography"
// GLOBAL CUSTOM COMPONENTS
import LazyImage from "components/LazyImage"
// LOCAL CUSTOM COMPONENTS
import DiscountChip from "../discount-chip"
// CUSTOM UTILS LIBRARY FUNCTIONS
import { calculateDiscount, currency } from "lib"
// STYLED COMPONENTS
import { PriceText, StyledRoot } from "./styles"
// CUSTOM DATA MODEL
import { DataList } from "@/models/AllProduct.model"
import { VariantOptionDetails } from "@/models/Filters"
import { Box, Chip } from "@mui/material"

// ==============================================================
type Props = { product: DataList; variantOptions: VariantOptionDetails[]; badges: string[] }
// ==============================================================

export default function ProductCard16({ product, variantOptions, badges }: Props) {
  console.warn(product, "product in product card 16")

  const imageAltTag = product.imageList?.[0]?.alt || "Product Image"
  const thumbnail = product.imageList?.[0]?.fullImagepath || "/assets/images/products/no-photo.png"
  const discount = product.savePricePctg || 0
  const price = +product.mrp.toFixed(2)
  const formattedFinalPrice = calculateDiscount(price, discount)

  return (
    <StyledRoot>
      <Link href={`/products/${product.itemId}?variantId=${product.itemVariantId || ""}`}>
        <div className="img-wrapper">
          <LazyImage unoptimized alt={imageAltTag} width={380} height={379} src={thumbnail} />
          {discount ? <DiscountChip discount={discount} sx={{ left: 20, top: 20 }} /> : null}
        </div>
      </Link>

      <div className="content">
  <div className="content-inner">
    {/* TITLE + UNIT */}
    <div className="title-row">
      <Typography variant="h6" className="title">
        {product.itemName}
      </Typography>

      {product.id && product.id!==0 && (
        <span
          className="unit-badge"
          style={{
            backgroundColor: product.backgroundColor || "#1967d2",
            color: product.fontColor || "#ffffff",
          }}
        >
          {product.unitName} 
        </span>
      )}
    </div>

    {/* VARIANT BADGES */}
    <Box className="variant-row">
    
      {variantOptions?.map(option =>
        badges.includes(option.optionName) ? (
          <Chip
            key={`${option.itemVariantId}-${option.optionName}`}
            label={`${option.optionName} - ${option.optionValue}`}
            size="small"
            color="primary"
          />
        ) : null
      )}
    </Box>

    {/* RATING */}
    <Rating readOnly value={0} size="small" precision={0.5} />

    {/* PRICE */}
    <PriceText>
      {formattedFinalPrice}
      {discount > 0 && <span className="base-price">{currency(price)}</span>}
    </PriceText>
  </div>
</div>

    </StyledRoot>
  )
}
