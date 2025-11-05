"use client"

import { FormProvider, TextField } from "@/components/form-hook"
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography
} from "@mui/material"
import Image from "next/image"
import React from "react"
import { useForm } from "react-hook-form"
import { OrderListCustomer, Item as Product } from "@/models/OrderHistory.modal"
import { orderReturn } from "@/utils/api/order"
import { OrderReturnPayload } from "@/models/Return.model"
import { useUser } from "@/contexts/UserContenxt"
import { currency } from "@/lib"

type Props = {
  handleCloseModal(isReloadRequired: boolean): void
  itemId: number
  variantId: number
  product: Product
  order: OrderListCustomer
}

const OrderItemReturn = ({ handleCloseModal, product, order }: Props) => {
  const { user } = useUser()
  const methods = useForm({
    defaultValues: {
      comment: "",
      attachments: [] as File[]
    }
  })

  const _price = (product.price + product.tax) * product.qty
  {
    currency(_price)
  }

  const onSubmit = async (data: { comment: string; attachments: File[] }) => {
    console.warn("Return Data:", data)
    const payload: OrderReturnPayload = {
      OrderDetailId: product.orderDetailId,
      OrderId: order.orderId,
      ItemId: product.itemId,
      ItemVariantId: product.itemVariantId,
      OrderQty: product.qty,
      status: "Return Requested",
      InvoiceId: product.invoiceId,
      Id: user?.id ?? "",
      InvoiceDetailId: order.invoiceDetailId,
      SerialNumber: null,
      DeliveryPersonId: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      Amount: _price,
      ItemCode: null,
      ItemName: product.name,
      ItemVariantName: product.name ?? "",
      DeliveredQty: product.invQty,
      IsSerialized: false,
      InvoiceNumber: order.invoiceNumber ?? "",
      storeId: 0
    }

    console.warn("Return payload:", payload)

    try {
      await orderReturn(payload)
      handleCloseModal(true)
    } catch (error) {
      console.error("Return Failed:", error)
      handleCloseModal(false)
    }
  }

  return (
    <Dialog open onClose={() => handleCloseModal(false)} fullWidth>
      <DialogTitle>
        <Typography variant="h4">Return Order</Typography>
      </DialogTitle>

      <Divider />

      <DialogContent>
        {/* Product */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2, gap: 1 }}>
          <Avatar variant="rounded" sx={{ height: 60, width: 60, backgroundColor: "grey.50" }}>
            <Image
              alt={product.imageAlt}
              src={product.imageName}
              width={50}
              height={50}
              style={{
                height: 60,
                width: 60,
                borderRadius: "100%",
                objectFit: "contain",
                border: "1px solid #ead7d7"
              }}
            />
          </Avatar>

          <div>
            <Typography noWrap variant="h6">
              {product.name}
            </Typography>
          </div>
        </Box>

        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 1, color: "grey.700", span: { color: "error.main" } }}
              color="grey.700"
            >
              Reason <span>*</span>
            </Typography>

            <TextField
              rows={4}
              multiline
              fullWidth
              name="comment"
              variant="outlined"
              placeholder="Why are you returning this item?"
            />
          </Box>

          <Box mt={3}>
            <Typography variant="h6" sx={{ mb: 1, color: "grey.700" }}>
              Upload Files
            </Typography>

            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                methods.setValue("attachments", files)
              }}
            />

            {methods.watch("attachments")?.length > 0 && (
              <Typography variant="body2" color="text.secondary" mt={1}>
                {methods.watch("attachments").length} file(s) selected
              </Typography>
            )}
          </Box>
        </FormProvider>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ paddingX: 3, paddingY: 2 }}>
        <Button onClick={() => handleCloseModal(false)} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={methods.handleSubmit(onSubmit)} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OrderItemReturn
