"use client"

import Image from "next/image"
import { useState } from "react"
import Box from "@mui/material/Box"
import Dialog from "@mui/material/Dialog"
import IconButton from "@mui/material/IconButton"
import Rating from "@mui/material/Rating"
import Typography from "@mui/material/Typography"
import Close from "@mui/icons-material/Close"
import ChevronLeft from "@mui/icons-material/ChevronLeft"
import ChevronRight from "@mui/icons-material/ChevronRight"
// LOCAL CUSTOM COMPONENT
// import ReviewForm from "./review-form"
// CUSTOM UTILS LIBRARY FUNCTION
import { getDateDifference } from "lib"
// STYLED COMPONENTS
import { ReviewRoot } from "./styles"
// API FUNCTIONS

import { GetReviewResponse } from "@/models/Rating.model"

interface Props {
  reviews: GetReviewResponse[]
}

// STATIC DEMO IMAGES — remove once the API returns real review images.


// Max thumbnails shown before collapsing the rest into a "+N" tile.
const MAX_THUMBS = 4

// State describing which image set/index is open in the lightbox.
type LightboxState = { images: string[]; index: number } | null

export default function ProductReviews({ reviews }: Props) {
  const [lightbox, setLightbox] = useState<LightboxState>(null)

  const openLightbox = (images: string[], index: number) => setLightbox({ images, index })
  const closeLightbox = () => setLightbox(null)

  const showPrev = () =>
    setLightbox((lb) =>
      lb ? { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length } : lb
    )

  const showNext = () =>
    setLightbox((lb) => (lb ? { ...lb, index: (lb.index + 1) % lb.images.length } : lb))

  if (!reviews?.length) {
    return (
      <div id="reviews-container">
        <Typography variant="body1">No reviews yet.</Typography>
      </div>
    )
  }

  return (
    <div id="reviews-container">
      {/* REVIEW LIST */}
      {reviews?.map(({ review, createdDate, customerName, rating, images }, ind) => {
        // Use API images when available, otherwise fall back to demo images.
        const reviewImages = images?.length ? images : []
        const visibleImages = reviewImages.slice(0, MAX_THUMBS)
        const remaining = reviewImages.length - MAX_THUMBS

        return (
          <ReviewRoot key={ind}>
            <div className="user-info">
              {/* <Avatar variant="rounded" className="user-avatar">
                <Image src={"/assets/images/products/no-photo.png"} alt={customerName} fill sizes="(48px 48px)" />
              </Avatar> */}

              <div>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {customerName}
                </Typography>

                <div className="user-rating">
                  <Rating size="small" value={rating} color="warn" readOnly />
                  {/* <Typography variant="h6">{rating}</Typography> */}
                  <Typography component="span">{getDateDifference(createdDate)}</Typography>
                </div>
              </div>
            </div>

            <Typography variant="body1" sx={{ color: "grey.700" }}>
              {review}
            </Typography>

            {/* REVIEW IMAGES */}
            {reviewImages.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {visibleImages.map((src, i) => {
                  const isLastVisible = i === MAX_THUMBS - 1
                  const showMoreOverlay = isLastVisible && remaining > 0

                  return (
                    <Box
                      key={i}
                      onClick={() => openLightbox(reviewImages, i)}
                      sx={{
                        position: "relative",
                        width: 88,
                        height: 88,
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "grey.200",
                        cursor: "pointer",
                        transition: "border-color 0.2s ease",
                        "&:hover": { borderColor: "primary.main" }
                      }}
                    >
                      <Image
                        src={src}
                        alt={`${customerName} review image ${i + 1}`}
                        fill
                        sizes="88px"
                        style={{ objectFit: "cover" }}
                      />

                      {showMoreOverlay && (
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(0,0,0,0.55)",
                            color: "common.white",
                            fontSize: 18,
                            fontWeight: 600
                          }}
                        >
                          +{remaining}
                        </Box>
                      )}
                    </Box>
                  )
                })}
              </Box>
            )}
          </ReviewRoot>
        )
      })}

      {/* IMAGE LIGHTBOX */}
      <Dialog
        open={Boolean(lightbox)}
        onClose={closeLightbox}
        maxWidth="md"
        fullWidth
        sx={{ zIndex: 1600 }}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "grey.900",
              position: "relative",
              overflowY: "auto",
              maxHeight: "90vh",
              m: 2
            }
          }
        }}
      >
        {lightbox && (
          <Box>
            {/* CLOSE */}
            <IconButton
              onClick={closeLightbox}
              sx={{ position: "absolute", top: 8, right: 8, color: "common.white", zIndex: 2 }}
            >
              <Close />
            </IconButton>

            {/* MAIN IMAGE */}
            <Box sx={{ position: "relative", width: "100%", height: { xs: "50vh", sm: "60vh" } }}>
              <Image
                src={lightbox.images[lightbox.index]}
                alt={`Review image ${lightbox.index + 1}`}
                fill
                sizes="(max-width: 900px) 100vw, 900px"
                style={{ objectFit: "contain" }}
              />

              {lightbox.images.length > 1 && (
                <>
                  <IconButton
                    onClick={showPrev}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: 8,
                      transform: "translateY(-50%)",
                      color: "common.white",
                      bgcolor: "rgba(0,0,0,0.4)",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.6)" }
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>

                  <IconButton
                    onClick={showNext}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: 8,
                      transform: "translateY(-50%)",
                      color: "common.white",
                      bgcolor: "rgba(0,0,0,0.4)",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.6)" }
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </>
              )}
            </Box>

            {/* COUNTER */}
            {lightbox.images.length > 1 && (
              <Typography
                sx={{ textAlign: "center", color: "common.white", py: 1, fontSize: 13 }}
              >
                {lightbox.index + 1} / {lightbox.images.length}
              </Typography>
            )}

            {/* THUMBNAIL STRIP */}
            {lightbox.images.length > 1 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  px: 2,
                  pb: 2
                }}
              >
                {lightbox.images.map((src, i) => (
                  <Box
                    key={i}
                    onClick={() => setLightbox((lb) => (lb ? { ...lb, index: i } : lb))}
                    sx={{
                      position: "relative",
                      width: 56,
                      height: 56,
                      borderRadius: 1,
                      overflow: "hidden",
                      cursor: "pointer",
                      border: "2px solid",
                      borderColor: i === lightbox.index ? "primary.main" : "transparent",
                      opacity: i === lightbox.index ? 1 : 0.6,
                      transition: "opacity 0.2s ease"
                    }}
                  >
                    <Image
                      src={src}
                      alt={`Review thumbnail ${i + 1}`}
                      fill
                      sizes="56px"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Dialog>

      {/* REVIEW FORM */}
      {/* <Typography variant="h3" sx={{ mt: 7, mb: 2.5 }}>
        Write a Review for this product
      </Typography>

      <ReviewForm /> */}
    </div>
  )
}
