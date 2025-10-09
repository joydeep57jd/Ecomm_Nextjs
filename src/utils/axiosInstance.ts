import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import { MockEndPoints } from "__server__"

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  }
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

    // Prevent caching
    config.params = {
      ...(config.params || {}),
      _t: Date.now() 
    }

    if (config.method?.toLowerCase() === "post") {
      const companyId = Number(process.env.NEXT_PUBLIC_COMPANY_ID)
      config.data = { ...(config.data || {}), companyId }
      config.params = { ...(config.params || {}), companyId }
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
