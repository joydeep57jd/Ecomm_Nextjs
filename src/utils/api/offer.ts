import { BannerOfferResponse, GetProductOfferResponse } from "@/models/Offer.model"
import axiosInstance from "../axiosInstance"
import API_URL from "../constants"

export const getOfferData = async (): Promise<BannerOfferResponse[] | null> => {
  const { data } = await axiosInstance.post<{
    data: BannerOfferResponse[]
  }>(API_URL.OFFER.GET_BANNER_OFFER, {})
  return data?.data?.length ? data.data : null
}

export const getOfferProducts = async (offerId: number, PageNumber = 1, PageSize = 10) => {
  const { data } = await axiosInstance.post<{ data: GetProductOfferResponse }>(
    API_URL.OFFER.GET_OFFER_PRODUCTS,
    { offerId, PageNumber, PageSize }
  )
  return data
}
