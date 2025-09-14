import User from "./User.model"

interface Item {
  product_img: string
  product_name: string
  product_price: number
  product_quantity: number
  variant?: string
}

export type OrderStatus = "Pending" | "Processing" | "Delivered" | "Cancelled"

interface Order {
  user: User
  id: string
  tax: number
  items: Item[]
  createdAt: Date
  discount: number
  deliveredAt: Date
  totalPrice: number
  isDelivered: boolean
  shippingAddress: string
  status: OrderStatus
}

export default Order

export interface CheckoutOrderRequest {
  discoutcode: string
  ordered: {
    items: CheckoutOrderItem[]
  }
}

export interface CheckoutOrderItem {
  id: number
  variantid: number
  rate: number
  quantity: number
  batchId: number
  status: string
}

export interface CheckoutOrderResponse {
  date: string
  deliverychargeamt: number
  totalamt: number
  totaltaxamt: number
  grandtotalamt: number
  deliveryslot: string
  deliverytxt: string
  vouchers: null
  item: CheckoutOrderItemResponse[]
}

export interface CheckoutOrderItemResponse {
  id: number
  variantid: number
  image: null
  name: string
  rate: number
  quantity: number
  itemamt: number
  taxrate: string
  taxamt: number
  itemtotalamount: number
  itemstatus: string
  taxdetails: Taxdetail[]
  taxdetailsid: number
  batchId: number
}

export interface Taxdetail {
  taxname: string
  taxpercentage: number
  taxtotal: number
  itemtotal: number
  taxType: null
}

export interface DeliveryChargeRequest {
  totalAmount: number
  taxAmount: number
  netAmount: number
  zipCode: string
}
