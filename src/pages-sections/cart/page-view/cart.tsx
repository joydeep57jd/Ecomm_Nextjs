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
import { getOrderSummary } from "@/utils/api/order"
import { CheckoutOrderRequest, CheckoutOrderResponse } from "@/models/Order.model"

export default function CartPageView() {

  const [isCartLoaded, setIsCartLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [checkoutOrderDetails, setCheckoutOrderDetails] = useState<CheckoutOrderResponse | null>(null)
  const { dispatch, state: { cart, orderSummaryFetchCount } } = useCart()
  const { user } = useUser()

  useEffect(() => {
    getCartItems()
  }, [orderSummaryFetchCount])

  const getCartItems = async () => {
    try {
      setIsLoading(true)
      const remoteCarts = await getCart(+user!.customerId)
      const finalCarts = getLocalCartFromRemoteCart(remoteCarts)
      const checkoutOrderRequest: CheckoutOrderRequest = {
        discoutcode: "",
        ordered: {
          items: remoteCarts.map(c => ({
            batchId: c.batchId,
            id: c.id,
            quantity: c.quantity,
            rate: c.price_regular,
            status: "order placed",
            variantid: c.variantid
          }))
        }
      }
      dispatch({
        type: "SET_CART",
        carts: finalCarts,
        isLoggedIn: true,
      })
      const checkoutOrderResponse = await getOrderSummary(checkoutOrderRequest)
      setCheckoutOrderDetails(checkoutOrderResponse)
    } catch {

    } finally {
      setIsLoading(false)
      setIsCartLoaded(true)
    }
  }


  if (!isCartLoaded) {
    return <Loading isSmallLoader={true} />
  }


  if (cart.length === 0) {
    return <EmptyCart />
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ md: 8, xs: 12 }}>
        {cart.map((item) => (
          <CartItem key={`${item.productId}-${item.itemVariantId}`} item={item} getCartItems={getCartItems} />
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
        <CheckoutForm checkoutOrderDetails={checkoutOrderDetails!} isLoading={isLoading} />
      </Grid>
    </Grid>
  )
}
