import type { Metadata } from "next"
import { RegisterPageView } from "pages-sections/sessions/page-view"

export const metadata: Metadata = {
  title: "Register - Super Shop",
  description:
    "Super Shop is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
}

export default function Register() {
  return <RegisterPageView />
}
