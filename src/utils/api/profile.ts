import { DelivaryAddressData } from "@/models/Address.model"
import axios from "../axiosInstance"
import {API_URL} from"../constants"


export const SaveAddress = async (data:DelivaryAddressData) => {
    return await axios.post(API_URL.ADDRESS.ADD, data)
}