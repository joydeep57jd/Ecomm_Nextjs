import Link from "next/link"
import Image from "next/image"
import Box from "@mui/material/Box"
import Star from "@mui/icons-material/Star"
import { BRAND } from "theme/brand"
// LOCAL CUSTOM COMPONENTS
import Discount from "./discount"
// GLOBAL CUSTOM COMPONENTS
import ProductAction from "@/components/product-action"
// STYLED COMPONENTS
import { ImageWrapper, ContentWrapper, StyledCard } from "./styles"
// CUSTOM UTILS FUNCTION
import { currency } from "lib"
import { encodeId } from "@/utils/url-id"
import { Product } from "@/models/Home.model"

// ========================================================
interface ProductCard17Props {
  // Accept either standard Product or wishlist item shape
  product: Product
  bgWhite?: boolean
  isWishList?: boolean
}
// ========================================================

// "+ ADD" outlined orange pill, matching the reference design. Applied to both
// the "+ ADD" and the post-add "Go to cart" states from ProductAction.
const ADD_BUTTON_SX = {
  px: 2,
  py: 0.6,
  minWidth: 72,
  flexShrink: 0,
  fontSize: 14,
  lineHeight: 1.4,
  fontWeight: 700,
  borderRadius: 999,
  boxShadow: "none",
  whiteSpace: "nowrap",
  textTransform: "none",
  color: BRAND.primary,
  backgroundColor: "transparent",
  border: "1px solid",
  borderColor: BRAND.primary,
  "&:hover": {
    boxShadow: "none",
    color: BRAND.primaryDark,
    borderColor: BRAND.primaryDark,
    backgroundColor: BRAND.primaryLight
  }
}

export default function ProductCard17({
  product,
  isWishList = false,
  bgWhite
}: ProductCard17Props) {
  const title = product.title
  const slug = product.slug
  const price = product.price
  const thumbnail = product.thumbnail
  const discount = product.discount
  const mrp = product.mrp
  const rating = product.rating
  const reviewCount = product.reviewCount
  const brand = product.businessUnitName
  const fontColor = product.fontColor
  const backgroundColor = product.backgroundColor

  const hasMrp = typeof mrp === "number" && mrp > price
  const outOfStock = (product.stockQty ?? 0) <= 0
  const productHref = `/products/${encodeId(slug)}${product.itemVariantId ? `?variantId=${encodeId(product.itemVariantId)}` : ""}`

  return (
    <StyledCard
      elevation={0}
      sx={{
        bgcolor: bgWhite ? "common.white" : "background.paper",
        transition: "transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 2
        }
      }}
    >
      <ImageWrapper>
        <Discount discount={discount} />

        <Link href={productHref} aria-label={`View ${title}`}>
          <Image
            width={550}
            height={550}
            src={thumbnail}
            alt={`Thumbnail for ${title}`}
            className="thumbnail"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading={isWishList ? "lazy" : "eager"}
          />
        </Link>

        {outOfStock && (
          <div className="stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}
      </ImageWrapper>

      <ContentWrapper>
        {brand && (
          <span
            className="brand"
            style={
              backgroundColor
                ? {
                    backgroundColor,
                    color: fontColor || "#fff",
                    padding: "2px 6px",
                    borderRadius: 4,
                    alignSelf: "flex-start"
                  }
                : undefined
            }
          >
            {brand}
          </span>
        )}

        <Link href={`/products/${encodeId(slug)}`} aria-label={`View ${title}`}>
          <span className="title">{title}</span>
        </Link>

        <Box className="rating-row" display="flex" alignItems="center" gap={0.75}>
          {typeof rating === "number" && rating > 0 && !!reviewCount && reviewCount > 0 && (
            <>
              <span className="rating-pill">
                {rating.toFixed(1)}
                <Star sx={{ fontSize: 13 }} />
              </span>
              <span className="review-count">({reviewCount})</span>
            </>
          )}
        </Box>

        <div className="footer">
          <Box minWidth={0}>
            <Box display="flex" alignItems="baseline" gap={0.75}>
              <span className="price">{currency(price, 0)}</span>
              {hasMrp && <span className="mrp">{currency(mrp, 0)}</span>}
            </Box>

            <span className="save" style={{ visibility: hasMrp ? "visible" : "hidden" }}>
              {hasMrp ? `Save ${currency(mrp - price, 0)}` : "—"}
            </span>
          </Box>

          {outOfStock ? (
            <span className=""></span>
          ) : (
            <ProductAction
              label="+ ADD"
              sx={ADD_BUTTON_SX}
              product={{
                productId: +product.id,
                productName: title,
                productPrice: price,
                productImage: thumbnail,
                itemVariantId: product.itemVariantId ?? product.variantId ?? 0,
                qty: 1,
                mrp: mrp ?? price,
                stockQty: product.stockQty,
                variantName: title,
                unitName: product.businessUnitName,
                businessUnitId: product.businessUnitId,
                variantOptionDetails: []
              }}
            />
          )}
        </div>
      </ContentWrapper>
    </StyledCard>
  )
}
