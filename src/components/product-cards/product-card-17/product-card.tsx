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
  isWishList = false,
}: ProductCard17Props) {

  console.warn(product)
  const title = isWishList ? product.name : product.title
  const slug = isWishList ? product.itemId : product.slug
  const price = isWishList ? product.price_member || product.price_regular : product.price
  const thumbnail = isWishList
    ? product.images?.[0]?.fullImagepath || "/placeholder.png"
    : product.thumbnail
  const discount = isWishList ? product.offer?.offerSavePrice || 0 : product.discount
  const categories = isWishList ? [product.category] : product.categories

  return (
    <StyledCard elevation={0} bgWhite={bgWhite}>
      <ImageWrapper>
        <Discount discount={discount} />

        <Link href={`/products/${slug}`} aria-label={`View ${title}`}>
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
