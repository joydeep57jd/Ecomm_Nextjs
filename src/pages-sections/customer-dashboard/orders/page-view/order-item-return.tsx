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
  IconButton,
  Typography
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"

import Image from "next/image"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { OrderListCustomer, Item as Product } from "@/models/OrderHistory.modal"
import { orderReturn, orderReturnImage } from "@/utils/api/order"
import { OrderReturnPayload, ReturnWithImagePayload } from "@/models/Return.model"
import { useUser } from "@/contexts/UserContenxt"
import { currency } from "@/lib"
import DeleteIcon from "@mui/icons-material/Delete"

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

const OrderItemReturn = ({ handleCloseModal, product, order }: Props) => {
  const { user } = useUser()
  const [fileLoading, setFileLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const methods = useForm<FormValues>({
    defaultValues: {
      comment: "",
      attachments: []
    }
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
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

      // console.log("✅ Final Payload Sent:", payload)

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
    <Dialog open onClose={() => handleCloseModal(false)} fullWidth maxWidth="sm">
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
            <Typography variant="subtitle1" sx={{ mb: 1, color: "grey.700" }}>
              Upload Files
            </Typography>

            {fileLoading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={22} />
                <Typography variant="body2" color="text.secondary">
                  Uploading files...
                </Typography>
              </Box>
            ) : (
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{
                  borderStyle: "dashed",
                  textTransform: "none",
                  borderColor: "grey.400",
                  color: "grey.700",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "rgba(25,118,210,0.04)"
                  }
                }}
              >
                Upload Files
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            )}

            {methods.watch("attachments")?.length > 0 && !fileLoading && (
              <Box mt={2} display="grid" gridTemplateColumns="repeat(auto-fill, 80px)" gap={1.5}>
                {methods.watch("attachments").map((file, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: "relative",
                      borderRadius: 1,
                      overflow: "hidden",
                      border: "1px solid #ccc"
                    }}
                  >
                    {file.base64.startsWith("data:image") ? (
                      <Image
                        src={file.base64}
                        alt={file.name}
                        width={80}
                        height={80}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 80,
                          width: 80,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "grey.100",
                          fontSize: 12
                        }}
                      >
                        PDF
                      </Box>
                    )}

                    <Typography
                      variant="caption"
                      noWrap
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        color: "white",
                        textAlign: "center",
                        fontSize: "0.65rem",
                        py: 0.3
                      }}
                    >
                      {file.name}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(i)}
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        backgroundColor: "rgba(255,255,255,0.7)",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" }
                      }}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
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
