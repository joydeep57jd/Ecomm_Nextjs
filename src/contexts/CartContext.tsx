



"use client"

import { CartProductItem } from "@/models/CartProductItem.models"
import { createContext, PropsWithChildren, useMemo, useReducer } from "react"
import { getCartProducts, setCart, clearCart, syncGuestCart } from "@/utils/services/cart.service"

// =================================================================================

type InitialState = {
  cart: CartProductItem[]
  isLoggedIn: boolean
}

interface CartActionType {
  payload?: CartProductItem
  type: "CHANGE_CART_AMOUNT" | "CLEAR_CART" | "SYNC_WITH_SERVER" | "SET_LOGGED_IN"
  isLoggedIn?: boolean
}

// =================================================================================



// Load initial cart from localStorage if available
const INITIAL_CART = getCartProducts()

const INITIAL_STATE: InitialState = {
  cart: INITIAL_CART,
  isLoggedIn: false
}

// ==============================================================
interface ContextProps {
  state: InitialState
  dispatch: (args: CartActionType) => void
}
// ==============================================================

export const CartContext = createContext<ContextProps>({} as ContextProps)
const reducer = (state: InitialState, action: CartActionType) => {
  switch (action.type) {
    case "CHANGE_CART_AMOUNT":
      const cartList = state.cart
      const cartItem = action.payload

      if (!cartItem) return state

      const existIndex = cartList.findIndex((item) => item.id === cartItem.id)

      if (cartItem.quantity < 1) {
        const updatedCart = cartList.filter((item) => item.id !== cartItem.id)
        setCart(updatedCart)
        return { ...state, cart: updatedCart }
      }

      // IF PRODUCT ALREADY EXITS IN CART
      if (existIndex > -1) {
        const updatedCart = [...cartList]
        updatedCart[existIndex].quantity = cartItem.quantity
        setCart(updatedCart)
        return { ...state, cart: updatedCart }
      }

      const newCart = [...cartList, cartItem]
      setCart(newCart)
      return { ...state, cart: newCart }

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
        clearCart()
      }
      return state

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

