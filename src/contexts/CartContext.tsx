
"use client"

import { Cart } from "@/models/CartProductItem.models"
import { createContext, PropsWithChildren, useMemo, useReducer } from "react"
import { getCartProducts, setCart, clearCart, syncGuestCart } from "@/utils/services/cart.service"
import { getItem } from "@/utils/services/local-storage.service"
import { UserData } from "@/models/Auth.model"

type InitialState = {
  cart: Cart[]
  isLoggedIn: boolean
}

interface CartActionType {
  payload?: Cart
  carts?: Cart[]
  type: "CHANGE_CART_AMOUNT" | "CLEAR_CART" | "SYNC_WITH_SERVER" | "SET_LOGGED_IN" | "SET_CART"
  isLoggedIn?: boolean
  user?: UserData
  isSyncRequired?: boolean
}


// Load initial cart from localStorage if available
const INITIAL_CART = getCartProducts()
const userDetails = getItem("userDetails")

const INITIAL_STATE: InitialState = {
  cart: INITIAL_CART,
  isLoggedIn: !!userDetails
}

interface ContextProps {
  state: InitialState
  dispatch: (args: CartActionType) => void
}


export const CartContext = createContext<ContextProps>({} as ContextProps)
const reducer = (state: InitialState, action: CartActionType) => {
  switch (action.type) {
    case "CHANGE_CART_AMOUNT":
      const cartList = [...state.cart]
      const cartItem = action.payload
      let updatedCart = []
      if (!cartItem) return state

      const existIndex = cartList.findIndex((item) => item.itemVariantId === cartItem.itemVariantId && item.productId === cartItem.productId)
      if (cartItem.qty < 1) {
        updatedCart = [...cartList]
        updatedCart.splice(existIndex, 1)
      } else if (existIndex > -1) {
        updatedCart = [...cartList]
        updatedCart[existIndex].qty = cartItem.qty
      } else {
        updatedCart = [...cartList, cartItem]
      }

      setCart(updatedCart)
      if (action.isLoggedIn) {
        syncGuestCart(updatedCart, action.user)
      }

      return { ...state, cart: updatedCart }

    case "CLEAR_CART":
      clearCart()
      return { ...state, cart: [] }

    case "SET_LOGGED_IN":
      if (action.isLoggedIn) {
        syncGuestCart(state.cart).then(() => {
          clearCart()
        })
      }
      return { ...state, isLoggedIn: action.isLoggedIn || false }

    case "SYNC_WITH_SERVER":
      if (state.isLoggedIn && state.cart.length > 0) {
        syncGuestCart(state.cart)
      }
      return state

    case "SET_CART":
      setCart(action.carts ?? [])
      if (action.isSyncRequired) {
        syncGuestCart(action.carts ?? [], action.user)
      }
      return { ...state, cart: action.carts ?? [], isLoggedIn: action.isLoggedIn ?? true }

    default: {
      return state
    }
  }
}

export default function CartProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

