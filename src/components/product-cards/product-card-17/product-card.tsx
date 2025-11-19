import Link from "next/link"
import Image from "next/image"
import Typography from "@mui/material/Typography"
// LOCAL CUSTOM COMPONENTS
import Discount from "./discount"
// STYLED COMPONENTS
import { ImageWrapper, ContentWrapper, StyledCard } from "./styles"
// CUSTOM UTILS FUNCTION
import { currency } from "lib"
import { Product } from "@/models/Home.model"

// ========================================================
interface ProductCard17Props {
  // Accept either standard Product or wishlist item shape
  product: Product
  bgWhite?: boolean
  isWishList?: boolean
}
// ========================================================

export default function ProductCard17({
  product,
  bgWhite = false,
  isWishList = false
}: ProductCard17Props) {
  const title = product.title
  const slug = product.slug
  const price = product.price
  const thumbnail = product.thumbnail
  const discount = product.discount
  const categories = product.categories

  return (
    <StyledCard elevation={0} bgWhite={bgWhite}>
      <ImageWrapper>
        <Discount discount={discount} />

        <Link
          href={`/products/${slug}${product.itemVariantId ? `?variantId=${product?.itemVariantId}` : ""}`}
          aria-label={`View ${title}`}
        >
          <Image
            width={750}
            height={750}
            src={thumbnail}
            alt={`Thumbnail for ${title}`}
            className="thumbnail"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading={isWishList ? "lazy" : "eager"}
          />
        </Link>
      </ImageWrapper>

      <ContentWrapper>
        <Typography noWrap variant="body2" className="category">
          {categories?.length > 0 ? categories[0] : "N/A"}
        </Typography>

        <Link href={`/products/${slug}`} aria-label={`View ${title}`}>
          <Typography noWrap variant="h5" className="title">
            {title}
          </Typography>
        </Link>

        <Typography variant="subtitle1" color="primary" fontWeight={600}>
          {currency(price)}
        </Typography>
      </ContentWrapper>
    </StyledCard>
  )
}
