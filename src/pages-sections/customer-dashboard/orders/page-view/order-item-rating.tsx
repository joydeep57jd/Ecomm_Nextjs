'use client'
import { RatingGroup } from '@/pages-sections/product-details/product-reviews/styles'
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Rating, Typography } from '@mui/material'
import React, { useState } from 'react'
import { FormProvider, TextField } from "components/form-hook"
import { useForm } from 'react-hook-form'
import { initialRatingFormValues, ratingSchema } from '@/schema/profile/rating.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { Item as Product } from "@/models/OrderHistory.modal"
import Image from 'next/image'
import { saveRating } from '@/utils/api/rating'
import { SaveRatingRequest } from '@/models/Rating.model'
import { useUser } from '@/contexts/UserContenxt'

type Props = {
    handleCloseModal(isReloadRequired: boolean): void,
    itemId: number,
    variantId: number
    product: Product
}

function OrderItemRating({ handleCloseModal, product }: Props) {
    const { user } = useUser()
    const [isSaving, setIsSaving] = useState(false)

    const methods = useForm({
        defaultValues: initialRatingFormValues,
        resolver: yupResolver(ratingSchema)
    })

    const {
        watch,
        setValue,
        getValues,
        formState
    } = methods

    const save = async () => {
        if (!formState.isValid) return
        setIsSaving(true)
        try {
            const payload: SaveRatingRequest = {
                note: getValues("comment"),
                rating: getValues("rating"),
                customerId: +user!.customerId,
                itemId: product.itemId,
                variantId: product.itemVariantId
            }
            await saveRating(payload)
            handleCloseModal(true)
        } catch {
        } finally {
            setIsSaving(false)

        }
    }

    return <Dialog open onClose={handleCloseModal} fullWidth>
        <DialogTitle>
            <Typography variant="h4">
                Add your review
            </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, gap: 1 }}>
                <Avatar variant="rounded" sx={{ height: 60, width: 60, backgroundColor: "grey.50" }}>
                    <Image alt={product.imageAlt} src={product.imageName} width={50} height={50} style={{
                        height: 60,
                        width: 60,
                        borderRadius: '100%',
                        objectFit: 'contain',
                        border: '1px solid #ead7d7'
                    }} />
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
                        onChange={(_, value) => setValue("rating", value!, { shouldValidate: true })}
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
            </FormProvider>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ paddingX: 3, paddingY: 2 }}>
            <Button onClick={() => handleCloseModal(false)} color="primary" variant="outlined">
                Cancel
            </Button>
            <Button onClick={save} loading={isSaving} color="primary" variant="contained">
                Save
            </Button>
        </DialogActions>
    </Dialog>
}

export default OrderItemRating