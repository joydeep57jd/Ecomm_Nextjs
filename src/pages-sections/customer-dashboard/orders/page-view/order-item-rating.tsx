"use client"
import { RatingGroup } from "@/pages-sections/product-details/product-reviews/styles"
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
  Rating,
  Typography
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DeleteIcon from "@mui/icons-material/Delete"
import React, { useState } from "react"
import { FormProvider, TextField } from "components/form-hook"
import { useForm } from "react-hook-form"
import { initialRatingFormValues, ratingSchema } from "@/schema/profile/rating.schema"
import { yupResolver } from "@hookform/resolvers/yup"
import { Item as Product } from "@/models/OrderHistory.modal"
import Image from "next/image"
import { saveRating } from "@/utils/api/rating"
import { ReviewImage, SaveRatingRequest } from "@/models/Rating.model"
import { useUser } from "@/contexts/UserContenxt"

const MAX_IMAGES = 5

type UploadedImage = {
  name: string
  base64: string
}

type Props = {
  handleCloseModal(isReloadRequired: boolean): void
  itemId: number
  variantId: number
  product: Product
}

function OrderItemRating({ handleCloseModal, product }: Props) {
  const { user } = useUser()
  const [isSaving, setIsSaving] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState("")
  const isEditMode = Boolean(product.ratingId)
  

   const methods = useForm({
    defaultValues: {
      ...initialRatingFormValues,
      
      ...(isEditMode && {
        rating: product.rating || 0,
        comment: product.note || ""
      })
    },
    resolver: yupResolver(ratingSchema)
  })


  const { watch, setValue, getValues } = methods

  const convertToBase64 = (files: File[]): Promise<UploadedImage[]> => {
    return new Promise((resolve, reject) => {
      const results: UploadedImage[] = []
      let processed = 0

      files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          results.push({ name: file.name, base64: reader.result as string })
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
    e.target.value = ""
    if (!files.length) return

    setImageError("")
    if (images.length + files.length > MAX_IMAGES) {
      setImageError(`You can upload a maximum of ${MAX_IMAGES} images.`)
      return
    }

    setImageLoading(true)
    try {
      const uploaded = await convertToBase64(files)
      setImages((prev) => [...prev, ...uploaded])
    } catch (err) {
      console.error("Image upload failed:", err)
      setImageError("Failed to read images. Please try again.")
    } finally {
      setImageLoading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImageError("")
  }

  const save = async () => {
    const isValid = await methods.trigger()
    if (!isValid) return
    setIsSaving(true)
    try {
      const reviewImages: ReviewImage[] = images.map((img) => ({
        Name: img.name,
        ImageData: img.base64.split(",")[1] ?? img.base64
      }))

      const payload: SaveRatingRequest = {
        note: getValues("comment"),
        rating: getValues("rating"),
        customerId: +user!.customerId,
        itemId: product.itemId,
        variantId: product.itemVariantId,
        OrderdetailId:product.orderDetailId,
        RatingId:product.ratingId || 0,
        ...(reviewImages.length > 0 && { Images: reviewImages })
      }
      await saveRating(payload)
      handleCloseModal(true)
    } catch {
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open onClose={() => handleCloseModal(false)} fullWidth>
     <DialogTitle>
        <Typography variant="h4">
          {isEditMode ? "Edit your review" : "Add your review"}
        </Typography>
        </DialogTitle>
      <Divider />
      <DialogContent>
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

        <FormProvider methods={methods} onSubmit={save}>
          <RatingGroup>
            <Typography
              variant="h6"
              sx={{ color: "grey.700", span: { color: "error.main" } }}
              color="grey.700"
            >
              Your Rating <span>*</span>
            </Typography>

            <Rating
              color="warn"
              size="medium"
              name="rating"
              value={watch("rating")}
              onChange={(_, value) => setValue("rating", value || 0, { shouldValidate: true })}
            />
          </RatingGroup>
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 1, color: "grey.700", span: { color: "error.main" } }}
              color="grey.700"
            >
              Your Review <span>*</span>
            </Typography>

            <TextField
              rows={4}
              multiline
              fullWidth
              name="comment"
              variant="outlined"
              placeholder="Write a review here..."
            />
          </Box>

          <Box mt={3}>
            <Typography
              variant="h6"
              sx={{ mb: 1, color: "grey.700" }}
              color="grey.700"
            >
              Add Photos{" "}
              <Typography component="span" variant="caption" color="grey.600">
                (optional, up to {MAX_IMAGES})
              </Typography>
            </Typography>

            {imageLoading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={22} />
                <Typography variant="body2" color="text.secondary">
                  Uploading images...
                </Typography>
              </Box>
            ) : (
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                disabled={images.length >= MAX_IMAGES}
                sx={{
                  textTransform: "none",
                  borderStyle: "dashed",
                  borderColor: "grey.400",
                  color: "grey.700"
                }}
              >
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            )}

            {imageError && (
              <Typography color="error" sx={{ mt: 1, fontSize: "0.8rem" }}>
                {imageError}
              </Typography>
            )}

            {images.length > 0 && !imageLoading && (
              <Box mt={2} display="grid" gridTemplateColumns="repeat(auto-fill, 80px)" gap={1.5}>
                {images.map((img, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: "relative",
                      borderRadius: 1,
                      overflow: "hidden",
                      border: "1px solid #ccc"
                    }}
                  >
                    <Image
                      src={img.base64}
                      alt={img.name}
                      width={80}
                      height={80}
                      style={{ objectFit: "cover", width: 80, height: 80 }}
                    />

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
      <DialogActions sx={{ paddingX: 3, paddingY: 2 }}>
        <Button onClick={() => handleCloseModal(false)} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={save}
          loading={isSaving}
          disabled={imageLoading}
          color="primary"
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OrderItemRating
