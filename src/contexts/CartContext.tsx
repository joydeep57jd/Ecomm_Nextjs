
"use client"

import { Cart } from "@/models/CartProductItem.models"
import { createContext, PropsWithChildren, useEffect, useMemo, useReducer } from "react"
import { getCartProducts, setCart, clearCart, syncGuestCart } from "@/utils/services/cart.service"
import { getItem } from "@/utils/services/local-storage.service"
import { UserData } from "@/models/Auth.model"

type InitialState = {
  cart: Cart[]
  isLoggedIn: boolean
  orderSummaryFetchCount: number
  isSyncRequired: boolean
  isOrderSummaryFetchCountUpDateRequired: boolean
  user?: UserData
  deleteItem?: Cart
}

interface CartActionType {
  payload?: Cart
  carts?: Cart[]
  type: "CHANGE_CART_AMOUNT" | "CLEAR_CART" | "SET_CART" | "UPDATE_FETCH_COUNT" | "SYNC_SUCCESS"
  isLoggedIn?: boolean
  user?: UserData
  isSyncRequired?: boolean
  isOrderSummaryFetchRequired?: boolean
}


// Load initial cart from localStorage if available
const INITIAL_CART = getCartProducts()
const userDetails = getItem("userDetails")

const INITIAL_STATE: InitialState = {
  cart: INITIAL_CART,
  isLoggedIn: !!userDetails,
  orderSummaryFetchCount: 0,
  isSyncRequired: false,
  isOrderSummaryFetchCountUpDateRequired: false
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
      let deleteItem

      const existIndex = cartList.findIndex((item) => item.itemVariantId === cartItem.itemVariantId && item.productId === cartItem.productId)
      if (cartItem.qty < 1) {
        updatedCart = [...cartList]
        deleteItem = { ...cartList[existIndex] }
        updatedCart.splice(existIndex, 1)
      } else if (existIndex > -1) {
        updatedCart = [...cartList]
        updatedCart[existIndex].qty = cartItem.qty
      } else {
        updatedCart = [...cartList, cartItem]
      }

      setCart(updatedCart)
      return { ...state, cart: updatedCart, isSyncRequired: true, user: action.user, isOrderSummaryFetchCountUpDateRequired: !!action.isOrderSummaryFetchRequired, deleteItem }

    case "CLEAR_CART":
      clearCart()
      return { ...state, cart: [], isSyncRequired: true, user: action.user }

    case "SET_CART":
      setCart(action.carts ?? [])
      return { ...state, cart: action.carts ?? [], isLoggedIn: action.isLoggedIn ?? true, isSyncRequired: true, user: action.user }
    case "UPDATE_FETCH_COUNT":
      return { ...state, orderSummaryFetchCount: state.orderSummaryFetchCount + 1, isOrderSummaryFetchCountUpDateRequired: false, isSyncRequired: false, deleteItem: undefined, cart: action.carts! }
    case "SYNC_SUCCESS":
      return { ...state, isSyncRequired: false, deleteItem: undefined, cart: action.carts! }

    default: {
      return state
    }
  }
}

export default function CartProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  useEffect(() => {
    if (state.isSyncRequired) {
      syncData(state)
    }
  }, [state])

  const syncData = async (state: InitialState) => {
    const finalCartItems = [...state.cart]
    const updatedCart = [...state.cart]
    if (state.deleteItem) {
      finalCartItems.push({ ...state.deleteItem, qty: 0 })
      const index = updatedCart.findIndex(c => c.itemVariantId === state.deleteItem?.itemVariantId && c.productId === state.deleteItem?.productId)
      if (index != -1) {
        updatedCart.splice(index, 1)
      }
    }

    await syncGuestCart(finalCartItems, state.user)

    if (state.isOrderSummaryFetchCountUpDateRequired) {
      dispatch({ type: "UPDATE_FETCH_COUNT", carts: updatedCart })
    } else {
      dispatch({ type: "SYNC_SUCCESS", carts: updatedCart })
    }
  }

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

