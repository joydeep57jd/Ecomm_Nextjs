"use client"
import { useUser } from "@/contexts/UserContenxt"
import useCart from "@/hooks/useCart"
import { UserData } from "@/models/Auth.model"
import { Cart } from "@/models/CartProductItem.models"
import { getCart } from "@/utils/api/cart"

import { useEffect } from "react"

export default function SyncCart() {
    const { user } = useUser()
    const { dispatch } = useCart()

    useEffect(() => {
        const syncCart = async () => {
            if (user) {
                syncUser(user)
            }
        }
        syncCart()
    }, [])

    const syncUser = async (user: UserData) => {
        const remoteCarts = await getCart(+user.customerId)
        const finalCarts: Cart[] = remoteCarts.map(cart => ({
            itemVariantId: cart.variantid,
            productId: cart.id,
            productImage: cart.images[0].fullImagepath,
            productName: cart.name,
            productPrice: cart.price_regular,
            qty: cart.quantity
        }))
        dispatch({
            type: "SET_CART",
            carts: finalCarts,
            isLoggedIn: true,
            remoteCarts
        })
    }

    return <></>
}