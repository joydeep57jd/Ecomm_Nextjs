"use client"

import { FormProvider, TextField } from "@/components/form-hook"
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography
} from "@mui/material"
import Image from "next/image"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { OrderListCustomer, Item as Product } from "@/models/OrderHistory.modal"
import { orderReturn, orderReturnImage } from "@/utils/api/order"
import { OrderReturnPayload, ReturnWithImagePayload } from "@/models/Return.model"
import { useUser } from "@/contexts/UserContenxt"
import { currency } from "@/lib"
import ImageUploadDropzone from "@/components/image-upload/dropzone"
import ImageUploadPreviewGrid from "@/components/image-upload/preview-grid"

type Props = {
  handleCloseModal(isReloadRequired: boolean): void
  itemId: number
  variantId: number
  product: Product
  order: OrderListCustomer
}

type UploadedFile = {
  name: string
  base64: string
}

type FormValues = {
  comment: string
  attachments: UploadedFile[]
}

const MAX_FILE_SIZE = 2 * 1024 * 1024

const OrderItemReturn = ({ handleCloseModal, product, order }: Props) => {
  const { user } = useUser()
  const [fileLoading, setFileLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [fileError, setFileError] = useState("")

  const methods = useForm<FormValues>({
    defaultValues: {
      comment: "",
      attachments: []
    }
  })

  methods.register("attachments", {
    validate: (files) => (files && files.length > 0) || "At least one file is required"
  })

  const _price = (product.price + product.tax) * product.qty

  const convertToBase64 = (files: File[]): Promise<UploadedFile[]> => {
    return new Promise((resolve, reject) => {
      const results: UploadedFile[] = []
      let processed = 0

      files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          results.push({
            name: file.name,
            base64: reader.result as string
          })
          processed++
          if (processed === files.length) resolve(results)
        }
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(file)
      })
    })
  }

  const handleFileChange = async (files: File[]) => {
    setFileError("")
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE)
    if (oversizedFiles.length > 0) {
      setFileError("Each file must be less than 2 MB.")
      return
    }

    setFileLoading(true)
    try {
      const uploaded = await convertToBase64(files)
      const existing = methods.getValues("attachments") || []
      methods.setValue("attachments", [...existing, ...uploaded])
    } catch (err) {
      console.error("File upload failed:", err)
    } finally {
      setFileLoading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    const updated = [...(methods.getValues("attachments") || [])]
    updated.splice(index, 1)
    methods.setValue("attachments", updated)
  }

  const onSubmit = async (data: FormValues) => {
    if (!data.comment.trim()) {
      alert("Reason is required.")
      return
    }

    setSaving(true)

    try {
      const imageIds: number[] = []

      if (data.attachments.length > 0) {
        await Promise.all(
          data.attachments.map(async (file) => {
            const base64 = file.base64.split(",")[1] ?? file.base64
            const imagePayload: ReturnWithImagePayload = {
              Name: file.name,
              Title: product.name || "Return Reason",
              AlterText: data.comment || "Returned Item",
              FilePath: null,
              ImageData: base64
            }

            const res = await orderReturnImage(imagePayload)

            if (res?.newImageId) {
              imageIds.push(res.newImageId)
            }
          })
        )
      }

      const imageIdsString = imageIds.length > 0 ? imageIds.join(",") : undefined

      const payload: OrderReturnPayload & { ImageIds?: string } = {
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
        storeId: 0,
        ReturnReason: data.comment,
        ...(imageIdsString && { ImageIds: imageIdsString })
      }

      

      await orderReturn(payload)

      handleCloseModal(true)
    } catch (error) {
      console.error("Return Failed:", error)
      handleCloseModal(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open
      onClose={() => handleCloseModal(false)}
      fullWidth
      maxWidth="sm"
      sx={{ zIndex: 1600 }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight={600}>
          Return Order
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
          <Avatar
            // variant="rounded"
            sx={{
              height: 60,
              width: 60,
              backgroundColor: "grey.50",
              border: "1px solid #ead7d7"
            }}
          >
            <Image
              alt={product.imageAlt}
              src={product.imageName}
              width={60}
              height={60}
              style={{
                height: 60,
                width: 60,
                borderRadius: "100%",
                objectFit: "contain"
              }}
            />
          </Avatar>

          <Typography noWrap variant="h6">
            {product.name}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Refund Amount: <strong>{currency(_price)}</strong>
        </Typography>

        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, color: "grey.700", span: { color: "error.main" } }}
            >
              Reason <span>*</span>
            </Typography>

            <TextField
              rows={4}
              multiline
              fullWidth
              {...methods.register("comment", {
                required: "Reason is required"
              })}
              variant="outlined"
              placeholder="Why are you returning this item?"
              error={!!methods.formState.errors.comment}
              helperText={methods.formState.errors.comment?.message}
            />
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: "grey.700", span: { color: "error.main" } }}>
              Upload Files <span>*</span>
            </Typography>

            <ImageUploadDropzone
              label="Upload Files"
              loading={fileLoading}
              accept="image/*,application/pdf"
              onFilesSelected={handleFileChange}
            />

            {fileError && (
              <Typography color="error" sx={{ mt: 1, fontSize: "0.8rem" }}>
                {fileError}
              </Typography>
            )}

            {methods.formState.errors.attachments && (
              <Typography color="error" sx={{ mt: 1, fontSize: "0.8rem" }}>
                {methods.formState.errors.attachments.message}
              </Typography>
            )}

            {!fileLoading && (
              <ImageUploadPreviewGrid
                items={(methods.watch("attachments") ?? []).map((file) => ({
                  name: file.name,
                  src: file.base64,
                  isImage: file.base64.startsWith("data:image")
                }))}
                onRemove={handleRemoveImage}
              />
            )}
          </Box>
        </FormProvider>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={() => handleCloseModal(false)} variant="outlined" color="primary">
          Cancel
        </Button>

        <Button
          onClick={methods.handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
          disabled={fileLoading || saving}
          startIcon={saving ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : undefined}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>

      {saving && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Dialog>
  )
}

export default OrderItemReturn
