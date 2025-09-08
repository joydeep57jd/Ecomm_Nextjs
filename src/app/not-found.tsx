import type { Metadata } from "next"
import { NotFoundPageView } from "pages-sections/not-found"

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "Page Not Found"
}

export default function NotFound() {
  return <NotFoundPageView />
}
