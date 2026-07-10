import * as yup from "yup"

export const ratingSchema = yup.object().shape({
  rating: yup.number().required("Rating is required!"),
  comment: yup
    .string()
    .required("Comment is required!")
    .max(300, "Review cannot exceed 300 characters")
})

export const initialRatingFormValues = {
  rating: 0,
  comment: ""
}

export type RatingSchemaType = yup.InferType<typeof ratingSchema>
