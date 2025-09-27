import { GetReviewPayload, GetReviewResponse, SaveRatingRequest } from "@/models/Rating.model"
import axiosInstance from "../axiosInstance"
import API_URL from "../constants"

export const saveRating = async (payload: SaveRatingRequest) => {
  await axiosInstance.post(API_URL.RATING.SAVE, payload)
}


export const getReviewRating = async(payload:GetReviewPayload)=>{
  const {data} = await axiosInstance.post<{data:GetReviewResponse[]}>(API_URL.RATING.GET,payload)
  return data.data

}
