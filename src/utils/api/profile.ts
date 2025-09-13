import { DelivaryAddressData } from "@/models/Address.model"
import axios from "../axiosInstance"
import { API_URL } from "../constants"
import { UserAddressListResponse } from "@/models/User.model"

export const SaveAddress = async (data: DelivaryAddressData) => {
  return await axios.post(API_URL.ADDRESS.ADD, data)
}

export const gerAddressList = async (customerid: number) => {
  const { data } = await axios.post<{ data: UserAddressListResponse }>(
    ``,
    {},
    { params: { customerid } }
  )
  return data.data
}
