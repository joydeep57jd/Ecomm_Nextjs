"use client"
import { useUser } from "@/contexts/UserContenxt"
import useCart from "@/hooks/useCart"
import { UserData } from "@/models/Auth.model"
import { Cart } from "@/models/CartProductItem.models"
import { getCart, getLocalCartFromRemoteCart } from "@/utils/api/cart"

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
        const finalCarts: Cart[] = getLocalCartFromRemoteCart(remoteCarts || [])
        dispatch({
            type: "SET_CART",
            carts: finalCarts,
            isLoggedIn: true,
            remoteCarts: remoteCarts || []
        })
    }

    return <></>
}