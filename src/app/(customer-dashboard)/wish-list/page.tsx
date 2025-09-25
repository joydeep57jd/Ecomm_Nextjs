"use client"

import { useUser } from "@/contexts/UserContenxt"
import { WishListCategory, CustomerWishItemElement } from "@/models/WishList.modal"
import { getCustomerWishItem, GetWishListCategory } from "@/utils/api/wishList"

import { WishListPageView } from "pages-sections/customer-dashboard/wish-list"
import { useEffect, useState } from "react"

export default function WishList() {
  const { user } = useUser()
  const [categories, setCategories] = useState<WishListCategory[]>([])
  const [activeCategory, setActiveCategory] = useState<WishListCategory | null>(null)
  const [omerWishItems, setOmerWishItems] = useState<CustomerWishItemElement[]>([])

  // Fetch categories
  useEffect(() => {
    if (!user) return

    const fetchCategories = async () => {
      try {
        const collections = await GetWishListCategory(+user.customerId)
        const cats = collections.getWishListCategory ?? []
        setCategories(cats)
        if (cats.length > 0) setActiveCategory(cats[0])
      } catch (err) {
        console.error("Error loading categories:", err)
      }
    }

    fetchCategories()
  }, [user])

  // Fetch items when active category changes
  useEffect(() => {
    if (!user || !activeCategory) return

    const fetchItems = async () => {
      try {
        const items = await getCustomerWishItem({
          wishListCategoryId: activeCategory.wishListCategoryId,
          customerId: +user.customerId,
        })
        setOmerWishItems(items)
      } catch (err) {
        console.error("Error fetching wishlist items:", err)
      }
    }

    fetchItems()
  }, [user, activeCategory])

  if (!user) return <div>Please log in to see your wishlist.</div>

  return (
    <WishListPageView
      categories={categories}
      activeCategory={activeCategory}
      onCategoryClick={setActiveCategory}
      items={omerWishItems}
    />
  )
}
