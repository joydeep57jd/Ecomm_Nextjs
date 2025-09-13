"use client"
import useCart from '@/hooks/useCart'
import { Cart } from '@/models/CartProductItem.models'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'
import AddToCart from './add-to-cart'
import { isProductAddedToCart } from '@/utils/api/product'
import { Button } from '@mui/material'

type Props = { product: Cart, fullWidth?: boolean };

const ProductAction = ({ product, fullWidth }: Props) => {
    const { state: { cart } } = useCart()
    const router = useRouter()

    const handleGoToCart = useCallback(() => {
        router.push("/cart")
    }, [])

    return isProductAddedToCart(cart, product.itemVariantId ?? 0, product.productId) ? <Button
        color="primary"
        fullWidth={fullWidth}
        variant="contained"
        onClick={handleGoToCart}
        aria-label="Go to cart">
        Go to cart
    </Button> : <AddToCart fullWidth={fullWidth} cart={product} />
}

export default ProductAction