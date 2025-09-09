import MobileCategoriesPageView from "./page-view"
// API FUNCTIONS
import api from "@/utils/api/category"

export default async function MobileCategories() {
  const data = await api.getLayoutData()
  return <MobileCategoriesPageView data={data} />
}
