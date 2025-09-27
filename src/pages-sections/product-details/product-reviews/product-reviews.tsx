"use client"

import Image from "next/image"
import Avatar from "@mui/material/Avatar"
import Rating from "@mui/material/Rating"
import Typography from "@mui/material/Typography"
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

export default  function ProductReviews({ reviews }: Props) {

 
  if (!reviews?.length) {
    return <Typography variant="body1">No reviews yet.</Typography>
  }

  return (
    <div>
      {/* REVIEW LIST */}
      {reviews?.map(({ review, createdDate, customerName,  rating }, ind) => (
        <ReviewRoot key={ind}>
          <div className="user-info">
            <Avatar variant="rounded" className="user-avatar">
              <Image src={"/assets/images/products/no-photo.png"} alt={customerName} fill sizes="(48px 48px)" />
            </Avatar>

            <div>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {customerName}
              </Typography>

              <div className="user-rating">
                <Rating size="small" value={rating} color="warn" readOnly />
                <Typography variant="h6">{rating}</Typography>
                <Typography component="span">{getDateDifference(createdDate)}</Typography>
              </div>
            </div>
          </div>

          <Typography variant="body1" sx={{ color: "grey.700" }}>
            {review}
          </Typography>
        </ReviewRoot>
      ))}

      {/* REVIEW FORM */}
      {/* <Typography variant="h3" sx={{ mt: 7, mb: 2.5 }}>
        Write a Review for this product
      </Typography>

      <ReviewForm /> */}
    </div>
  )
}
