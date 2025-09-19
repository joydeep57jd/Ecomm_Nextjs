export interface OrderResponse {
  orderListCustomer: OrderListCustomer[]
  count: number
}

export interface OrderListCustomer {
  custOrdNo: string
  orderDateStr: string
  invoiceNumber: null | string
  orderStatus: string
  invoiceDate: null | string
  items: Item[]
  orderDate: Date
  subTotal: string
  tax: string
  discount: string
  delvCharge: string
  total: string
  orderId: number
  totalInvoiceAmount: string
  paidAmount: string
  isCancel: boolean
  cancelDate: string
  isInvoiced: boolean
}

export interface Item {
  name: string
  lastReturnDate: string
  isReturn: boolean
  itemId: number
  itemVariantId: number
  color: string
  size: string
  imageName: string
  imageAlt: string
  qty: number
  rating: number
  price: number
  tax: number
  taxRate: number
  invQty: number
  invDate: string
  status: string
}

export interface OrderPayload {
  UserId: string
  RecordFrom: number
  RecordTo: number
}
