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
// import { currency } from "@/lib"

// ✅ Yup Validation
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

const returnSchema = yup.object().shape({
  comment: yup
    .string()
    .required("Reason is required")
    .min(3, "Reason must be at least 3 characters")
})

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
    resolver: yupResolver(returnSchema),
    defaultValues: {
      comment: ""
    }
  })

  const _price = (product.price + product.tax) * product.qty

  const onSubmit = async () => {
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
        {/* Product Info */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
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

          <Typography noWrap variant="h6">
            {product.name}
          </Typography>
        </Box>

        
        {/* <Typography variant="body2" sx={{ mb: 2 }}>
          Refund Amount: <strong>{currency(_price)}</strong>
        </Typography> */}

        {/* Form */}
        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 1, color: "grey.700", span: { color: "error.main" } }}
            >
              Reason <span>*</span>
            </Typography>

            <TextField
              rows={4}
              multiline
              fullWidth
              {...methods.register("comment")}
              variant="outlined"
              placeholder="Why are you returning this item?"
              error={!!methods.formState.errors.comment}
              helperText={methods.formState.errors.comment?.message}
            />
          </Box>
        </FormProvider>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
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
