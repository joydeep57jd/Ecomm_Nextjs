"use client"

import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import AddIcon from "@mui/icons-material/Add"
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined"
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
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { rememberUnitColors } from "@/utils/services/unit-colors.service"
import { BRAND } from "theme/brand"

const deliveryInfo = [
  {
    icon: <LocationOnOutlinedIcon sx={{ fontSize: 20, color: BRAND.primary, mt: "2px" }} />,
    title: "Deliver to Location",
    subtitle: "1–2 days"
  },
  {
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 20, color: BRAND.primary, mt: "2px" }} />,
    title: "Free over ₹499",
    subtitle: "Local delivery"
  },
  {
    icon: <ReplayOutlinedIcon sx={{ fontSize: 20, color: BRAND.primary, mt: "2px" }} />,
    title: "7-day returns",
    subtitle: "Easy & quick"
  },
  {
    icon: <VerifiedOutlinedIcon sx={{ fontSize: 20, color: BRAND.primary, mt: "2px" }} />,
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
  // Product Details tabs: 0 = Description, 1 = Specification
  const [detailsTab, setDetailsTab] = useState(0)
  const specifications = product.variantOptionList ?? []

  // Cache this unit's colors so the cart can reuse them for guest items added
  // from sources that don't return colors.
  useEffect(() => {
    rememberUnitColors(
      product.variantDetails?.unitName,
      product.variantDetails?.backgroundColor,
      product.variantDetails?.fontColor
    )
  }, [product.variantDetails])

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

  const handleShare = async () => {
    if (typeof window === "undefined") return
    const url = window.location.href
    const title = product.variantDetails?.itemName || product.variantDetails?.variantName || "Product"
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        enqueueSnackbar("Product link copied to clipboard", { variant: "success" })
      }
    } catch {
      // Share dialog dismissed or unavailable — no action needed.
    }
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
              p: 2,
              bgcolor: "#fff"
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
              color: BRAND.storeLabel,
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
                      bgcolor: BRAND.primaryLight,
                      color: BRAND.primaryDark,
                      border: `1px solid ${BRAND.primaryBorder}`,
                      boxShadow: "none",
                      fontWeight: 600,
                      "&:hover": { bgcolor: BRAND.pageBg, boxShadow: "none" }
                    }}
                  />
                </Box>
                <Button
                  variant="contained"
                  startIcon={<ShareOutlinedIcon />}
                  onClick={handleShare}
                  fullWidth
                  sx={{
                    flex: 1,
                    bgcolor: BRAND.primaryDark,
                    color: BRAND.primaryContrast,
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": { bgcolor: BRAND.primary, boxShadow: "none" }
                  }}
                >
                  Share
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

          {/* Product details: switch between Description and Specification */}
          <Box>
            <Tabs
              value={detailsTab}
              onChange={(_, value) => setDetailsTab(value)}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                minHeight: 0,
                mb: 1.5,
                borderBottom: "1px solid",
                borderColor: "divider",
                "& .MuiTab-root": {
                  minHeight: 40,
                  fontWeight: 600,
                  fontSize: 14,
                  textTransform: "none"
                }
              }}
            >
              <Tab label="Description" />
              <Tab label="Specification" />
            </Tabs>

            {/* Description */}
            {detailsTab === 0 &&
              (product.variantDetails?.itemDesc ? (
                <Box
                  sx={{ color: "#1a1a1a", fontSize: 14, lineHeight: 1.7 }}
                  dangerouslySetInnerHTML={{ __html: product.variantDetails.itemDesc }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No description available.
                </Typography>
              ))}

            {/* Specification */}
            {detailsTab === 1 &&
              (specifications.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  {specifications.map((spec, index) => (
                    <Typography key={index} variant="body2" sx={{ color: "#1a1a1a" }}>
                      <Box component="strong" sx={{ fontWeight: 700 }}>
                        {spec.optionName}
                      </Box>
                      : {spec.optionValue}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No specifications available.
                </Typography>
              ))}
          </Box>
        </Grid>
      </Grid>
    </StyledRoot>
  )
}
