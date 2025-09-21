"use client"

import Image from "next/image"
import { Fragment, useState } from "react"
import { PreviewImage, ProductImageWrapper } from "./styles"
import { ImageList } from "@/models/AllProduct.model"
import Wishlist from "./wishlist"
import { SingleProductResponse } from "@/models/SingleProduct.model"

type Props = {
  images: ImageList[],
  product: SingleProductResponse
}

export default function ProductGallery({ images, product }: Props) {
  const [currentImage, setCurrentImage] = useState(0)

  return (
    <Fragment>
      <ProductImageWrapper>
        <img src={images[currentImage].fullImagepath} className="w-full h-auto" alt="product" />
        {/* <Image fill alt="product" src={images[currentImage].fullImagepath} sizes="(400px 400px)" /> */}
        {!!product?.variantDetails?.itemVariantId &&
          <Wishlist product={product} />
        }
      </ProductImageWrapper>

      <div className="preview-images">
        {images.map((image, ind) => (
          <PreviewImage
            key={ind}
            onClick={() => setCurrentImage(ind)}
            selected={currentImage === ind}
          >
            <Image fill alt="product" src={image.fullImagepath} sizes="(48px 48px)" />
          </PreviewImage>
        ))}
      </div>
    </Fragment>
  )
}
