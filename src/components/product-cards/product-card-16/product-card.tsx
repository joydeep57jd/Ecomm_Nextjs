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
type Props = { product: DataList, variantOptions: VariantOptionDetails[] };
// ==============================================================

export default function ProductCard16({ product, variantOptions }: Props) {

  const imageAltTag = product.imageList?.[0]?.alt || "Product Image"
  const thumbnail = product.imageList?.[0]?.fullImagepath || "/assets/images/products/no-photo.png"
  const discount = product.savePricePctg || 0
  const price = +(product.mrp).toFixed(2)
  const formattedFinalPrice = calculateDiscount(price, discount)

  return (
    <StyledRoot>
      <Link href={`/products/${product.itemId}?variantId=${product.itemVariantId || ''}`}>
        <div className="img-wrapper">
          <LazyImage unoptimized alt={imageAltTag} width={380} height={379} src={thumbnail} />
          {discount ? <DiscountChip discount={discount} sx={{ left: 20, top: 20 }} /> : null}
        </div>
      </Link>

      <div className="content">
        <div>
          <Link href={`/products/${product.itemId}`}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {product.itemName}
            </Typography>
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mb: 2
            }}>
              {
                variantOptions.map(option => <Box key={`${option.itemVariantId}-${option.optionName}`}>
                  <Chip
                    label={`${option.optionName} - ${option.optionValue}`}
                    size="small"
                    color="primary"
                    variant="filled"
                  />
                </Box>)
              }
            </Box>
          </Link>

          <Rating readOnly value={0} size="small" precision={0.5} />

          <PriceText>
            {formattedFinalPrice}
            {discount > 0 && <span className="base-price">{currency(price)}</span>}
          </PriceText>
        </div>
      </div>
    </StyledRoot>
  )
}
