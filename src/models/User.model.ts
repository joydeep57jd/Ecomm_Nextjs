export default interface User {
  id: string
  email: string
  phone: string
  avatar: string
  password: string
  dateOfBirth: Date | string
  verified: boolean
  name: { firstName: string; lastName: string }
}

export interface Profile extends User {
  type: string
  balance: number
}

export interface UserAddressListResponse {
  customerId: number
  data: Address[]
  type: AddressType[]
}

export interface Address {
  addrid: number
  fname: string
  mname: string
  lname: string
  phone: string
  email: string
  address1: string
  address2: string
  pin: string
  city: string
  dist: string
  state: string
  country: string
  countrycode: null
  type: string
  customerId: number
  phoneCode: string
  phoneCountryCode: string
}

export interface AddressType {
  id: number
  type: string
}

export interface UserProfile {
  custId: number
  compId: number
  custFName: string
  custMName: string
  custLName: string
  custPhone: string
  custPhoneCode: string
  custEmail: string
  billAddr1: string
  billAddr2: string
  billCityTownVill: string
  billPIN: string
  billDist: string
  billState: string
  billCountry: string
  custCountryCode: string
  userType: string
}

export interface SaveUserProfilePayload {
  Token: string
  CustomerProfileDtl: UserProfile
}
