"use client"

import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import BoltIcon from "@mui/icons-material/Bolt"
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined"
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined"
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined"
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import ProductGallery from "./product-gallery"
import ProductVariantSelector from "./product-variant-selector"
import { currency } from "lib"
import { StyledRoot } from "./styles"
import { SingleProductResponse, VariantOption } from "@/models/SingleProduct.model"
import ProductAction from "../../../components/product-action"
import Loading from "@/app/loading"
import useCart from "@/hooks/useCart"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContenxt"

const ICON_COLOR = "#e05c23"

const deliveryInfo = [
  {
    icon: <LocationOnOutlinedIcon sx={{ fontSize: 20, color: ICON_COLOR, mt: "2px" }} />,
    title: "Deliver to Location",
    subtitle: "1–2 days"
  },
  {
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 20, color: ICON_COLOR, mt: "2px" }} />,
    title: "Free over ₹499",
    subtitle: "Local delivery"
  },
  {
    icon: <ReplayOutlinedIcon sx={{ fontSize: 20, color: ICON_COLOR, mt: "2px" }} />,
    title: "7-day returns",
    subtitle: "Easy & quick"
  },
  {
    icon: <VerifiedOutlinedIcon sx={{ fontSize: 20, color: ICON_COLOR, mt: "2px" }} />,
    title: "100% genuine",
    subtitle: "19 yrs of trust"
  }
]

type Props = {
  product: SingleProductResponse
  variantMap: Map<string, VariantOption[]>
  selectedVariant: string
  isLoading: boolean
  onShowReviews?: () => void
}

export default function ProductIntro({
  product,
  variantMap,
  selectedVariant,
  isLoading,
  onShowReviews
}: Props) {
  const { dispatch } = useCart()
  const { user } = useUser()
  const router = useRouter()

  const isOutOfStock = product.priceAndStock?.stockQty === 0 || product.priceAndStock === null

  const hasDiscount =
    product.priceAndStock?.salePrice !== product.priceAndStock?.mrp &&
    product.priceAndStock?.savePricePctg > 0
  const discountPct = Math.round(product.priceAndStock?.savePricePctg)

  const cartProduct =
    product.imageList?.length > 0 && product.priceAndStock
      ? {
          productId: product.variantDetails?.itemId,
          itemVariantId: product.variantDetails?.itemVariantId,
          productPrice: product.priceAndStock?.salePrice,
          productName: product.variantDetails?.itemName,
          productImage: product.imageList[0]?.fullImagepath,
          qty: 1,
          stockQty: product.priceAndStock?.stockQty,
          variantName: product.variantDetails?.variantName,
          mrp: product.priceAndStock?.mrp,
          unitName: product.variantDetails?.unitName,
          businessUnitId: +(product.variantDetails?.businessUnitId || 0),
          backgroundColor: product.variantDetails?.backgroundColor,
          fontFontColor: product.variantDetails?.fontColor,
          variantOptionDetails: product.variantOptionList?.map((variant) => ({
            itemVariantId: 0,
            optionName: variant?.optionName,
            optionValue: variant?.optionValue,
            variantOptionId: 0,
            variantOptionValueId: variant?.variantOptionValueId
          })),
          isOutOfStock
        }
      : null

  const handleBuyNow = () => {
    if (!cartProduct || isOutOfStock) return
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: { ...cartProduct, qty: 1 },
      isLoggedIn: !!user,
      user: user ?? undefined
    })
    router.push(
      user ? `/checkout?businessUnitId=${product.variantDetails?.businessUnitId}` : "/login"
    )
  }

  return (
    <StyledRoot style={{ position: "relative" }}>
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 9,
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0000001f"
          }}
        >
          <Loading isSmallLoader />
        </Box>
      )}

      <Grid container spacing={4} alignItems="flex-start">
        {/* LEFT: image gallery */}
        <Grid size={{ lg: 6, md: 6, xs: 12 }}>
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "#f0f5f0",
              p: 2
            }}
          >
            <ProductGallery product={product} images={product.imageList ?? []} />
          </Box>
        </Grid>

        {/* RIGHT: product info */}
        <Grid size={{ lg: 6, md: 6, xs: 12 }}>
          {/* Store label */}
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.2,
              color: "#c84b31",
              textTransform: "uppercase",
              mb: 0.75
            }}
          >
            SUPER SHOPPING
          </Typography>

          {/* Product name */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 22, md: 28 },
              fontWeight: 700,
              color: "#1a1a1a",
              mb: 1.5,
              lineHeight: 1.2
            }}
          >
            {product.variantDetails?.variantName}
          </Typography>
          <Typography variant="h2" sx={{fontSize: { xs: 8, md: 12 },
              fontWeight: 400,
              color: "#1a1a1a",
              mb: 1.5,
              lineHeight: 1.2}}>
            Product Code: <strong>{product.variantDetails?.itemCode}</strong>
          </Typography>

          {/* Rating row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5, flexWrap: "wrap" }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.4,
                bgcolor: "#2e7d32",
                color: "#fff",
                borderRadius: 1,
                px: 0.9,
                py: 0.3,
                fontSize: 13,
                fontWeight: 700,
                lineHeight: 1.6
              }}
            >
              {product?.variantDetails?.itemRating?.toFixed(1) ?? "—"} ★
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" }
              }}
              onClick={onShowReviews}
            >
              ({product.variantDetails?.reviewCount ?? 0})
            </Typography>
          </Box>

          {/* Variant selector */}
          <Box sx={{ mb: 2 }}>
            <ProductVariantSelector
              product={product}
              variantMap={variantMap}
              selectedVariant={selectedVariant}
            />
          </Box>

          {/* Price card */}
          <Box
            sx={{
              border: "1px solid #e8e8e8",
              borderRadius: 4,
              p: 2,
              mb: 2.5,
              bgcolor: "#fff"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Typography sx={{ fontSize: 30, fontWeight: 800, color: "#1a1a1a", lineHeight: 1 }}>
                {currency(product.priceAndStock?.salePrice)}
              </Typography>

              {hasDiscount && (
                <Typography
                  component="span"
                  sx={{ fontSize: 16, color: "text.secondary", textDecoration: "line-through" }}
                >
                  {currency(product.priceAndStock?.mrp)}
                </Typography>
              )}

              {hasDiscount && discountPct > 0 && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "#2e7d32",
                    fontSize: 13,
                    fontWeight: 700
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                  {discountPct}% OFF
                </Box>
              )}
            </Box>

            <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.75 }}>
              Inclusive of all taxes ·{" "}
              <Box
                component="span"
                sx={{ color: isOutOfStock ? "error.main" : "success.main", fontWeight: 500 }}
              >
                {isOutOfStock ? "Out of stock" : "In stock"}
              </Box>
            </Typography>
            {cartProduct && (
              <Box sx={{ display: "flex", gap: 1.5, mb: 0.5, mt: 1.25 }}>
                <Box sx={{ flex: 1 }}>
                  <ProductAction
                    product={cartProduct}
                    fullWidth
                    label="ADD"
                    startIcon={<AddIcon />}
                    sx={{
                      bgcolor: "#fff7f5",
                      color: "#c84b31",
                      border: "1px solid #e8b4a0",
                      boxShadow: "none",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#fce8e2", boxShadow: "none" }
                    }}
                  />
                </Box>
                <Button
                  variant="contained"
                  startIcon={<BoltIcon />}
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  fullWidth
                  sx={{
                    flex: 1,
                    bgcolor: "#BE123C",
                    color: "#fff",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#BE123C", boxShadow: "none" }
                  }}
                >
                  Buy Now
                </Button>
              </Box>
            )}
          </Box>

          {/* Action buttons */}

          {/* Delivery info grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.25,
              mb: 3
            }}
          >
            {deliveryInfo.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  border: "1px solid #f0f0f0",
                  borderRadius: 1.5,
                  p: 1.25,
                  bgcolor: "#fafafa"
                }}
              >
                {item.icon}
                <Box>
                  <Typography
                    sx={{ fontSize: 12.5, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.4 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: "text.secondary", lineHeight: 1.4 }}>
                    {item.subtitle}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Product details */}
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 1, color: "#1a1a1a" }}>
              Product Details
            </Typography>

            <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
              {/* <Box component="span" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
                Description:{" "}
              </Box> */}
              {/* <Box component="span" sx={{ color: "#1a1a1a" }}>
                {product.variantDetails?.variantName}
              </Box> */}
              {product.variantDetails?.itemDesc && (
                <Box
                  component="span"
                  sx={{ color: "#1a1a1a" }}
                  dangerouslySetInnerHTML={{ __html: product.variantDetails.itemDesc }}
                />
              )}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </StyledRoot>
  )
}
