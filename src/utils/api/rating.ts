import { GetReviewPayload, GetReviewResponse, SaveRatingRequest } from "@/models/Rating.model"
import axiosInstance from "../axiosInstance"
import API_URL from "../constants"

export const saveRating = async (payload: SaveRatingRequest) => {
  const formData = new FormData()
  formData.append("itemId", String(payload.itemId))
  formData.append("variantId", String(payload.variantId))
  formData.append("customerId", String(payload.customerId))
  formData.append("rating", String(payload.rating))
  formData.append("note", payload.note ?? "")
  formData.append("OrderdetailId", String(payload.OrderdetailId))
  formData.append("RatingId", String(payload.RatingId ?? 0))

  payload.Images?.forEach((file) => {
    formData.append("Images", file, file.name)
  })

  await axiosInstance.post(API_URL.RATING.SAVE, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })
}

export const getReviewRating = async (payload: GetReviewPayload) => {
  const { data } = await axiosInstance.post<{ data: GetReviewResponse[] }>(
    API_URL.RATING.GET,
    payload
  )
  return data.data
}
