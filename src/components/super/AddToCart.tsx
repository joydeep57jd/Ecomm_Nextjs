"use client"

import { Plus, Check } from "lucide-react"
import useCart from "@/hooks/useCart"
import { useUser } from "@/contexts/UserContenxt"
import { useCartDrawer } from "@/contexts/CartDrawerContext"
import { isProductAddedToCart } from "@/utils/api/product"
import { cn } from "./cn"

export interface SuperCartItem {
  itemId: number
  name: string
  price: number
  mrp: number
  image: string
  stockQty: number
}

/** Add-to-cart button wired to the existing cart context. `fullWidth` renders the card variant. */
export function AddToCart({
  item,
  className,
  fullWidth
}: {
  item: SuperCartItem
  className?: string
  fullWidth?: boolean
}) {
  const { user } = useUser()
  const {
    state: { cart },
    dispatch
  } = useCart()
  const { setOpen } = useCartDrawer()

  const added = isProductAddedToCart(cart, 0, item.itemId)
  const soldOut = !item.stockQty

  const handleAdd = () => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: {
        productId: item.itemId,
        productName: item.name,
        productPrice: item.price,
        qty: 1,
        productImage: item.image,
        itemVariantId: 0,
        stockQty: item.stockQty,
        mrp: item.mrp,
        variantName: item.name,
        variantOptionDetails: []
      },
      isLoggedIn: !!user,
      user: user ?? undefined
    })
    setOpen(true)
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={soldOut}
      aria-label={added ? `Added ${item.name}` : `Add ${item.name} to cart`}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold shadow-sm transition active:scale-[0.98]",
        fullWidth ? "h-10 w-full text-sm" : "h-9 shrink-0 px-3 text-sm",
        soldOut
          ? "cursor-not-allowed bg-slate-100 text-muted shadow-none"
          : added
            ? "bg-fresh-600 text-white hover:bg-fresh-700"
            : "bg-brand text-white hover:bg-brand-700",
        className
      )}
    >
      {soldOut ? (
        "Sold out"
      ) : added ? (
        <>
          <Check size={16} strokeWidth={2.4} /> {fullWidth ? "Added to cart" : "Added"}
        </>
      ) : (
        <>
          <Plus size={16} strokeWidth={2.6} /> {fullWidth ? "Add to Cart" : "Add"}
        </>
      )}
    </button>
  )
}
