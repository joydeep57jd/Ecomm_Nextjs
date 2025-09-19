import { DelivaryAddressData } from "@/models/Address.model"
import axios from "../axiosInstance"
import { API_URL } from "../constants"
import { SaveUserProfilePayload, UserAddressListResponse, UserProfile } from "@/models/User.model"

export const SaveAddress = async (data: DelivaryAddressData) => {
  return await axios.post(API_URL.ADDRESS.ADD, data)
}

export const getAddressList = async (customerid: number) => {
  const { data } = await axios.post<{ data: UserAddressListResponse }>(
    API_URL.ADDRESS.LIST,
    {},
    { params: { customerid } }
  )
  return data.data
}

export const deleteAddress = async (addressId: number) => {
  const { data } = await axios.post<{ data: UserAddressListResponse }>(API_URL.ADDRESS.DELETE, {
    addressId
  })
  return data.data
}

export const userProfile = async (UserId: string) => {
  const { data } = await axios.post<{ data: UserProfile }>(API_URL.USER.GET_PROFILE, { UserId })
  return data.data
}

export const saveUserProfile = async (payload: SaveUserProfilePayload): Promise<UserProfile> => {
  const { data } = await axios.post<{ data: UserProfile }>(API_URL.USER.SAVE_PROFILE, payload)
  return data.data
}
