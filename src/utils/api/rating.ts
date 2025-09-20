import { SaveRatingRequest } from "@/models/Rating.model"
import axiosInstance from "../axiosInstance"
import API_URL from "../constants"

export const saveRating = async (payload: SaveRatingRequest) => {
  await axiosInstance.post(API_URL.RATING.SAVE, payload)
}
