"use client"
import React, { createContext, ReactNode, useContext } from "react"
import { Category } from "@/models/Category.modal"

const CategoriesContext = createContext<Category[]>([])

export const CategoriesProvider = ({
  categories,
  children
}: {
  categories: Category[]
  children: ReactNode
}) => {
  return <CategoriesContext.Provider value={categories}>{children}</CategoriesContext.Provider>
}

export const useCategories = () => useContext(CategoriesContext)
