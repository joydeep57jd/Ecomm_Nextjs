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

export interface PlaceOrderRequest {
  customer: Customer
  order: OrderData
}

export interface Customer {
  userid: string
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
  type: string
  spclrequest: string
  paymentmode: string
  deliveryslot: string
}

export interface OrderData {
  orderdate: string
  totalamt: number
  totaltaxamt: number
  deliverychargeamt: number
  grandtotalamt: number
  discount_code: string
  discount_total: string
  data: CheckoutOrderItemResponse[]
}

export interface PlaceOrderResponse {
  companyid: number
  customer: Customer
  customerId: number
  order: OrderData
  orderId: number
  orderNo: string
  orderStatus: string
  status: string
  loginInfo: Object
}

export interface CustCancelRequest {
  OrderId: number
  InvoiceId?: number
  OrderDetailId: number
  InvoiceDetailId: number
  Timestamp: Date
  CancelReasonId: number
  Explanation: string
  UserId: string
  UserName: string
}
