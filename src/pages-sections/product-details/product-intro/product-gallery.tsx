"use client"

import Image from "next/image"
import { Fragment, useState } from "react"
import { PreviewImage, ProductImageWrapper } from "./styles"
import { ImageList } from "@/models/AllProduct.model"
import Wishlist from "./wishlist"
import { SingleProductResponse } from "@/models/SingleProduct.model"

type Props = {
  images: ImageList[]
  product: SingleProductResponse
}

export default function ProductGallery({ images, product }: Props) {
  const [currentImage, setCurrentImage] = useState(0)
  const brandLogo = product?.variantDetails?.brandLogoFileName
  // const discount = product?.priceAndStock?.savePricePctg

  return (
    <Fragment>
      <ProductImageWrapper>
        <img
          src={images[currentImage]?.fullImagepath || "/assets/images/products/no-photo.png"}
          className="w-full h-auto"
          alt="product"
        />
        {!!product?.variantDetails?.itemVariantId && <Wishlist product={product} />}

        {/* BRAND LOGO */}
        {brandLogo && (
          <div
            style={{
              position: "absolute",
              top: 2,
              left: 100,
              borderRadius: 8,
              padding: "4px 8px",
              zIndex: 2
            }}
          >
            <Image
              src={brandLogo}
              alt="brand"
              width={80}
              height={40}
              style={{ objectFit: "contain", mixBlendMode: "multiply" }}
            />
          </div>
        )}
      </ProductImageWrapper>

      <div className="preview-images">
        {images?.map((image, ind) => (
          <PreviewImage
            key={ind}
            onClick={() => setCurrentImage(ind)}
            selected={currentImage === ind}
          >
            <Image fill alt="product" src={image?.fullImagepath} sizes="(48px 48px)" />
          </PreviewImage>
        ))}
      </div>
    </Fragment>
  )
}
