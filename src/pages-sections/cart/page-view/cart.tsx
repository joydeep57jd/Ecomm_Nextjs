"use client"

import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart"
// CUSTOM COMPONENTS
import CartItem from "../cart-item"
import EmptyCart from "../empty-cart"
import CheckoutForm from "../checkout-form"
import { useEffect, useState } from "react"
import Loading from "@/app/loading"
import { getCart, getLocalCartFromRemoteCart } from "@/utils/api/cart"
import { useUser } from "@/contexts/UserContenxt"


export default function CartPageView() {
  const [isCartLoaded, setIsCartLoaded] = useState(false)
  const { dispatch, state: { remoteCarts, orderSummaryFetchCount, isLoading } } = useCart()
  const { user } = useUser()

  useEffect(() => {
    getCartItems()
  }, [orderSummaryFetchCount])

  const getCartItems = async () => {
    try {
      const remoteCarts = await getCart(+user!.customerId)
      const finalCarts = getLocalCartFromRemoteCart(remoteCarts || [])
      dispatch({
        type: "SET_CART",
        carts: finalCarts,
        isLoggedIn: true,
        remoteCarts: remoteCarts || [],
        isSyncRequired: false,
      })
    } catch {

    } finally {
      setIsCartLoaded(true)
    }
  }


  if (!isCartLoaded) {
    return <Loading isSmallLoader={true} />
  }


  if (remoteCarts?.length === 0) {
    return <EmptyCart />
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ md: 8, xs: 12 }}>
        {remoteCarts!.map((item) => (
          <CartItem key={`${item.id}-${item.variantid}`} item={item} getCartItems={getCartItems} />
        ))}
        <Box textAlign="end">
          {/* <Button
            disableElevation
            color="error"
            variant="outlined"
            startIcon={<Trash fontSize="small" />}
            onClick={() => dispatch({ type: "CLEAR_CART" })}
          >
            Clear Cart
          </Button> */}
        </Box>
      </Grid>

      <Grid size={{ md: 4, xs: 12 }}>
        <CheckoutForm isLoading={isLoading} />
      </Grid>
    </Grid>
  )
}
