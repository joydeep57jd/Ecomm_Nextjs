// MUI
import Grid from "@mui/material/Grid"
import Rating from "@mui/material/Rating"
import Typography from "@mui/material/Typography"
// LOCAL CUSTOM COMPONENTS
import ProductGallery from "./product-gallery"
import ProductVariantSelector from "./product-variant-selector"
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib"
// STYLED COMPONENTS
import { StyledRoot } from "./styles"
// CUSTOM DATA MODEL

import { SingleProductResponse, VariantOption } from "@/models/SingleProduct.model"

import ProductAction from "../../../components/product-action"
import Loading from "@/app/loading"


// ================================================================
type Props = {
  product: SingleProductResponse
  variantMap: Map<string, VariantOption[]>
  selectedVariant: string
  isLoading: boolean
  onShowReviews?: () => void

}
// ================================================================

export default function ProductIntro({ product, variantMap, selectedVariant, isLoading, onShowReviews }: Props) {
  return (
    <StyledRoot style={{ position: 'relative' }}>
      {
        isLoading && <div
          style={{
            position: "absolute",
            zIndex: 9,
            width: "100%",
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: 0,
            left: 0,
            background: '#0000001f'
          }}
        >
          <Loading isSmallLoader={true} />
        </div>
      }
      <Grid container spacing={3} justifyContent="space-around">
        {/* IMAGE GALLERY AREA */}
        <Grid size={{ lg: 6, md: 7, xs: 12 }}>
          <ProductGallery product={product} images={product.imageList ?? []} />
        </Grid>

        <Grid size={{ lg: 5, md: 5, xs: 12 }}>
          <Typography variant="h1">{product.variantDetails?.variantName}</Typography>

          {/* <Typography variant="body1">
            Category: <strong>{product.variantDetails?.variantName}</strong>
          </Typography> */}

          <Typography variant="body1">
            Product Code: <strong>{product.variantDetails?.itemCode}</strong>
          </Typography>

          <Typography variant="body1" fontSize={30} fontWeight={700} sx={{ my: 1 }}>
            {currency(product.priceAndStock?.salePrice)}

            {product.priceAndStock?.salePrice !== product.priceAndStock?.mrp && (
              <Typography
                component="span"
                sx={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "text.secondary",
                  textDecoration: "line-through",
                  ml: 1
                }}
              >
                {currency(product.priceAndStock?.mrp)}
              </Typography>
            )}
          </Typography>

          {/* PRODUCT BRAND */}
          {/* {product. && (
            <p className="brand">
              Brand: <strong>{product.brand}</strong>
            </p>
          )} */}

          {/* PRODUCT RATING */}
          <div className="rating">
            <span>Rated:</span>
            <Rating readOnly color="warn" size="small" value={product?.variantDetails?.itemRating} />
            {/* <Typography variant="h6">({product.reviews?.length || 0})</Typography> */}
            <Typography variant="h6" style={{ cursor: "pointer" }} onClick={onShowReviews}>({product.variantDetails?.reviewCount})</Typography>
          </div>

          {/* PRODUCT VARIANTS */}
          <ProductVariantSelector product={product} variantMap={variantMap} selectedVariant={selectedVariant} />

          {/* PRICE & STOCK */}
          <div className="price">
            <Typography variant="h2" sx={{ color: "primary.main", mb: 0.5, lineHeight: 1 }}>
              {/* {currency(product.priceAndStock?.salePrice)} */}
            </Typography>

            <p>{product.priceAndStock?.stockQty > 0 ? "Stock Available" : "Out of Stock"}</p>
          </div>

          {/* ADD TO CART BUTTON */}
          {
            product.imageList?.length > 0 && product.priceAndStock &&
            <ProductAction product={{
              productId: product.variantDetails?.itemId,
              itemVariantId: product.variantDetails?.itemVariantId,
              productPrice: product.priceAndStock?.salePrice,
              productName: product.variantDetails?.itemName,
              productImage: product.imageList[0].fullImagepath,
              qty: 1,
              stockQty: product.priceAndStock?.stockQty,
              variantName: product.variantDetails.variantName,
              mrp: product.priceAndStock.mrp,
              variantOptionDetails: product.variantOptionList.map(variant => ({
                itemVariantId: 0,
                optionName: variant.optionName,
                optionValue: variant.optionValue,
                variantOptionId: 0,
                variantOptionValueId: variant.variantOptionValueId
              }))

            }} />
          }

         

          {/* SHOP NAME */}
        </Grid>
      </Grid>
    </StyledRoot>
  )
}
