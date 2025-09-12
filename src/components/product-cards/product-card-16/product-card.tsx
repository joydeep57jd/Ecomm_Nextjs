import Link from "next/link"
import Rating from "@mui/material/Rating"
import Typography from "@mui/material/Typography"
// GLOBAL CUSTOM COMPONENTS
import LazyImage from "components/LazyImage"
// LOCAL CUSTOM COMPONENTS
import AddToCart from "./add-to-cart"
import DiscountChip from "../discount-chip"
// CUSTOM UTILS LIBRARY FUNCTIONS
import { calculateDiscount, currency } from "lib"
// STYLED COMPONENTS
import { PriceText, StyledRoot } from "./styles"
// CUSTOM DATA MODEL
import { DataList } from "@/models/AllProduct.model"

// ==============================================================
type Props = { product: DataList };
// ==============================================================

export default function ProductCard16({ product }: Props) {

  const imageAltTag = product.imageList?.[0]?.alt || "Product Image"
  const thumbnail = product.imageList?.[0]?.fullImagepath || "/assets/images/products/iphone-x.png"
  const discount = product.savePricePctg || 0
  const price = +(product.mrp).toFixed(2)

  return (
    <StyledRoot>
      <Link href={`/products/${product.itemId}`}>
        <div className="img-wrapper">
          <LazyImage alt={imageAltTag} width={380} height={379} src={thumbnail} />
          {discount ? <DiscountChip discount={discount} sx={{ left: 20, top: 20 }} /> : null}
        </div>
      </Link>

      <div className="content">
        <div>
          <Link href={`/products/${product.itemId}`}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {product.itemName}
            </Typography>
          </Link>

          <Rating readOnly value={0} size="small" precision={0.5} />

          <PriceText>
            {calculateDiscount(price, discount)}
            {discount>0 &&  <span className="base-price">{currency(price)}</span>}
          </PriceText>
        </div>

        {/* ADD TO CART BUTTON */}
        <AddToCart cart={{
          productId: +product.id,
          productName: product.itemName,
          productPrice: product.memberPrice,
          qty: 1,
          productImage: product.imageList[0].fullImagepath,
          itemVariantId: 0
        }} />
      </div>
    </StyledRoot>
  )
}
