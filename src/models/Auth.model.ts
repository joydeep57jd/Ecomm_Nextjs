

export interface OTPCredentials {
  PhoneCode: string
  PhoneNo: string
  otp: string
}

export type SignupData = {
  username?: string
  email: string
  password: string
  phone: string
  firstName: string
  middleName?: string
  lastName: string
  country?: string
  countryCode: string
}

export interface ForgotPasswordData {
  email: string
  newPassword: string
  otp: string
}

export interface CustomerPayload {
  PhoneCode: string
  PhoneNo: string
}

export interface CustomerResponse {
  customer: Customer
  alreadyCustomer: boolean
}

export interface Customer {
 
  phoneCode: string
  phone: string
}

export interface LoginRequest {
  UserName: string   
  Password: string   
}



export interface LoginResponse {
  status: boolean
  data: UserData
  message: string
}

export interface UserData {
  id: string
  companyId: number
  firstName: string
  lastName: string
  middleName: string | null
  userEmail: string
  token: string
  phone: string
  phoneCode: string | null
  customerId: string
  isActive: boolean
  currencyMasterId: number
  countryCode: string
  currencyCode: string
  currencySymbol: string
  userPhoneCode: string
  userPhoneCountryCode: string
  userType: "b2c" | "b2b" | string 
}
