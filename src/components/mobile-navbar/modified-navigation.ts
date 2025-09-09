import { Category } from "@/models/Category.modal"

// MODIFY THE NAVIGATION WITH NEW STRUCTURE
export const updateNavigation = (navigation: Category[]) => {
  return navigation.map((curr) => {
    return { title: curr.name, child: curr.sub_category }
  })
}
