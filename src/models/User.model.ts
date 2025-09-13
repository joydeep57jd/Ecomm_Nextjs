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
