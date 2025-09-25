"use client"

import Loading from "@/app/loading"
import { useUser } from "@/contexts/UserContenxt"
import { WishListCategory, CustomerWishItemElement } from "@/models/WishList.modal"
import { getCustomerWishItem, GetWishListCategory } from "@/utils/api/wishList"

import { WishListPageView } from "pages-sections/customer-dashboard/wish-list"
import { useCallback, useEffect, useState } from "react"

export default function WishList() {
  const { user } = useUser()
  const [categories, setCategories] = useState<WishListCategory[]>([])
  const [activeCategory, setActiveCategory] = useState<WishListCategory | null>(null)
  const [omerWishItems, setOmerWishItems] = useState<Record<string, CustomerWishItemElement[]>>({})

  // Fetch categories
  useEffect(() => {
    fetchCategories(+user!.customerId)
  }, [user])

  const fetchCategories = useCallback(async (customerId: number) => {
    try {
      const collections = await GetWishListCategory(customerId)
      const cats = collections.getWishListCategory ?? []
      const collectionItem = await Promise.all(cats.map(cat => getCustomerWishItem({ wishListCategoryId: cat.wishListCategoryId, customerId: customerId })))
      const customerWishItems = cats.reduce<Record<number, CustomerWishItemElement[]>>((acc, cur, index) => {
        acc[cur.wishListCategoryId] = collectionItem[index]
        return acc
      }, {})
      setOmerWishItems(customerWishItems)
      setCategories(cats)
      if (cats.length > 0) setActiveCategory(cats[0])
    } catch (err) {
      console.error("Error loading categories:", err)
    }
  }, [])

  // Fetch items when active category changes
  // useEffect(() => {
  //   if (!activeCategory) return
  //   fetchItems(+user!.customerId, activeCategory.wishListCategoryId)
  // }, [user, activeCategory])


  // const fetchItems = useCallback(async (customerId: number, wishListCategoryId: number) => {
  //   try {
  //     const items = await getCustomerWishItem({ wishListCategoryId: wishListCategoryId, customerId: customerId })
  //     setOmerWishItems(items)
  //   } catch (err) {
  //     console.error("Error fetching wishlist items:", err)
  //   }
  // }, [])

  if (!categories) {
    return <Loading isSmallLoader={true} />
  }

  return (
    <WishListPageView
      categories={categories}
      activeCategory={activeCategory}
      onCategoryClick={setActiveCategory}
      items={omerWishItems}
    />
  )
}
