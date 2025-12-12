export interface DelivaryAddressData {
  CustomerId: number
  customer: Customer
}

export interface Customer {
  userid: string
  addrid: number

  fname: string
  lname: string
  phone: string
  address1: string
  pin: string
  country: string

  mname?: string
  email?: string
  address2?: string
  city?: string
  dist?: string
  state?: string
  type?: string
  spclrequest?: string | null
  paymentmode?: string | null
  deliveryslot?: string | null
  UserPhoneCountryCode?: string
  PhoneCode?: string
  isDefault?: boolean

}
