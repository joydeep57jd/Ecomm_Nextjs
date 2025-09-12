"use client"

import Image from "next/image"
import { Fragment, useState } from "react"
import { PreviewImage, ProductImageWrapper } from "./styles"
import { ImageList } from "@/models/AllProduct.model"

export default function ProductGallery({ images }: { images: ImageList[] }) {
  const [currentImage, setCurrentImage] = useState(0)

  return (
    <Fragment>
      <ProductImageWrapper>
        <img src={images[currentImage].fullImagepath} className="w-full h-auto" alt="product" />
        {/* <Image fill alt="product" src={images[currentImage].fullImagepath} sizes="(400px 400px)" /> */}
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
