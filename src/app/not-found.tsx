import type { Metadata } from "next"
import { NotFoundPageView } from "pages-sections/not-found"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "Page Not Found"
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundPageView />
    </Suspense>
  )
}
