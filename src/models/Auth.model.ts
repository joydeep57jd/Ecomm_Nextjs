export interface LoginCredentials {
  email: string
  password: string
}

export interface OTPCredentials {
  phoneNumber: string
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
