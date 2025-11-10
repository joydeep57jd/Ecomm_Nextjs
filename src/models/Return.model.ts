export interface OrderReturnPayload {
  OrderDetailId: number

  OrderId: number
  ItemId: number
  ItemVariantId: number
  OrderQty: number
  status: string
  InvoiceId: number
  Id: string
  InvoiceDetailId: number
  SerialNumber: string | null
  DeliveryPersonId: string | null
  Amount: number
  ItemCode: string | null
  ItemName: string
  ItemVariantName: string
  DeliveredQty: number
  IsSerialized: boolean
  InvoiceNumber: string
  storeId: number
  ImageIds?:string
  ReturnReason:string
}

export interface ReturnWithImagePayload {
  Name: string
  Title: string
  AlterText: string
  FilePath: string| null
  ImageData: string
}
