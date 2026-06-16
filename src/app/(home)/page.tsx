import type { Metadata } from "next"
import SuperHomeView from "@/components/super/SuperHomeView"

export const metadata: Metadata = {
  title: "Super Shop",
  description:
    "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
}

export default function Home() {
  return <SuperHomeView />
}
