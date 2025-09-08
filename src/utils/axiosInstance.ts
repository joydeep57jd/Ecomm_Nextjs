import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import { MockEndPoints } from "__server__"

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  
})



// Remove following 2 lines if you don't want to use MockAdapter
export const Mock = new MockAdapter(axiosInstance)
MockEndPoints(Mock)

axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.method?.toLowerCase() === "post") {
      const companyId = Number(process.env.NEXT_PUBLIC_COMPANY_ID) 
      if (config.data && typeof config.data === "object") {
        config.data = { ...config.data, companyId }
      } else {
        config.data = { companyId }
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance 
