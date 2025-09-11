"use client"

import { createContext, PropsWithChildren, useMemo, useReducer } from "react"

// =================================================================================
type InitialState = { cart: CartItem[] };

export interface CartItem {
  id: string;
  qty: number;
  title: string;
  slug: string;
  price: number;
  thumbnail: string;
}

interface CartActionType {
  payload?: CartItem;
  type: "CHANGE_CART_AMOUNT" | "CLEAR_CART";
}

// =================================================================================

const INITIAL_CART = [
  {
    qty: 1,
    price: 210,
    slug: "silver-high-neck-sweater",
    title: "Silver High Neck Sweater",
    id: "6e8f151b-277b-4465-97b6-547f6a72e5c9",
    thumbnail: "/assets/images/products/Fashion/Clothes/1.SilverHighNeckSweater.png"
  },
  {
    qty: 1,
    price: 110,
    slug: "yellow-casual-sweater",
    title: "Yellow Casual Sweater",
    id: "76d14d65-21d0-4b41-8ee1-eef4c2232793",
    thumbnail: "/assets/images/products/Fashion/Clothes/21.YellowCasualSweater.png"
  },
  {
    qty: 1,
    price: 140,
    slug: "denim-blue-jeans",
    title: "Denim Blue Jeans",
    id: "0fffb188-98d8-47f7-8189-254f06cad488",
    thumbnail: "/assets/images/products/Fashion/Clothes/4.DenimBlueJeans.png"
  }
]

const INITIAL_STATE = { cart: INITIAL_CART }

// ==============================================================
interface ContextProps {
  state: InitialState;
  dispatch: (args: CartActionType) => void;
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

      // REMOVE ITEM IF QUANTITY IS LESS THAN 1
      if (cartItem.qty < 1) {
        const updatedCart = cartList.filter((item) => item.id !== cartItem.id)
        return { ...state, cart: updatedCart }
      }

      // IF PRODUCT ALREADY EXITS IN CART
      if (existIndex > -1) {
        const updatedCart = [...cartList]
        updatedCart[existIndex].qty = cartItem.qty
        return { ...state, cart: updatedCart }
      }

      return { ...state, cart: [...cartList, cartItem] }

    case "CLEAR_CART":
      return { ...state, cart: [] }

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




// "use client"

// import { CartProductItem } from "@/models/CartProductItem.models"
// import { createContext, PropsWithChildren, useMemo, useReducer } from "react"
// import { getCartProducts, setCart, clearCart, syncGuestCart } from "@/utils/services/cart.service"

// // =================================================================================

// type InitialState = {
//   cart: CartProductItem[]
//   isLoggedIn: boolean
// }

// interface CartActionType {
//   payload?: CartProductItem
//   type: "CHANGE_CART_AMOUNT" | "CLEAR_CART" | "SYNC_WITH_SERVER" | "SET_LOGGED_IN"
//   isLoggedIn?: boolean
// }

// // =================================================================================



// // Load initial cart from localStorage if available
// const INITIAL_CART = getCartProducts()

// const INITIAL_STATE: InitialState = {
//   cart: INITIAL_CART,
//   isLoggedIn: false
// }

// // ==============================================================
// interface ContextProps {
//   state: InitialState
//   dispatch: (args: CartActionType) => void
// }
// // ==============================================================

// export const CartContext = createContext<ContextProps>({} as ContextProps)
// const reducer = (state: InitialState, action: CartActionType) => {
//   switch (action.type) {
//     case "CHANGE_CART_AMOUNT":
//       const cartList = state.cart
//       const cartItem = action.payload

//       if (!cartItem) return state

//       const existIndex = cartList.findIndex((item) => item.id === cartItem.id)

//       // REMOVE ITEM IF QUANTITY IS LESS THAN 1
//       if (cartItem.quantity < 1) {
//         const updatedCart = cartList.filter((item) => item.id !== cartItem.id)
//         setCart(updatedCart)
//         return { ...state, cart: updatedCart }
//       }

//       // IF PRODUCT ALREADY EXITS IN CART
//       if (existIndex > -1) {
//         const updatedCart = [...cartList]
//         updatedCart[existIndex].quantity = cartItem.quantity
//         setCart(updatedCart)
//         return { ...state, cart: updatedCart }
//       }

//       const newCart = [...cartList, cartItem]
//       setCart(newCart)
//       return { ...state, cart: newCart }

//     case "CLEAR_CART":
//       clearCart()
//       return { ...state, cart: [] }

//     case "SET_LOGGED_IN":
//       if (action.isLoggedIn) {
//         // If user is logging in, sync guest cart with server
//         syncGuestCart(state.cart).then(() => {
//           clearCart() // Clear local storage after syncing
//         })
//       }
//       return { ...state, isLoggedIn: action.isLoggedIn || false }

//     case "SYNC_WITH_SERVER":
//       if (state.isLoggedIn && state.cart.length > 0) {
//         syncGuestCart(state.cart)
//         clearCart()
//       }
//       return state

//     default: {
//       return state
//     }
//   }
// }

// export default function CartProvider({ children }: PropsWithChildren) {
//   const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

//   const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

//   return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
// }

