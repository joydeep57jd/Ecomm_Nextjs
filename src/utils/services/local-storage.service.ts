/* eslint-disable @typescript-eslint/no-explicit-any */
import CryptoJS from "crypto-js"

const keyPrefix = process.env.NEXT_PUBLIC_LOCALSTORAGE_KEY_PREFIX
const secretKey = "wizerdcomm"

export const setItem = (key: string, value: any) => {
  if (typeof window === "undefined") return
  const ciphertext = encrypt(JSON.stringify(value))
  localStorage.setItem(`${keyPrefix}${key}`, ciphertext)
}

export const getItem = (key: string): any | null => {
  if (typeof window === "undefined") return null

  const value = localStorage.getItem(`${keyPrefix}${key}`)
  if (typeof value === "undefined") return null
  if (!value) return null
  return JSON.parse(decrypt(value!))
}

const encrypt = (data: string): string => {
  const ciphertext = CryptoJS.AES.encrypt(data, secretKey).toString()
  return ciphertext
}

const decrypt = (ciphertext: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey)
  const originalText = bytes.toString(CryptoJS.enc.Utf8)
  return originalText
}

export const removeItem = (key: string) => {
  if (typeof window === "undefined") return
  localStorage.removeItem(`${keyPrefix}${key}`)
}
