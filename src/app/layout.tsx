import { Suspense, type ReactNode } from "react"
import { Geist } from "next/font/google"

export const geist = Geist({
  subsets: ["latin"]
})

import "overlayscrollbars/overlayscrollbars.css"

// THEME PROVIDER
import ThemeProvider from "theme/theme-provider"

// PRODUCT CART PROVIDER
import CartProvider from "contexts/CartContext"

// GLOBAL CUSTOM COMPONENTS
import ProgressBar from "components/progress"

// IMPORT i18n SUPPORT FILE
import "i18n"
import HeaderLayout from "@/components/layouts/header-layout"
import { UserProvider } from "@/contexts/UserContenxt"

// ==============================================================
interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}
// ==============================================================

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body id="body" className={geist.className}>
        <Suspense fallback={<div>Loading...</div>}>
          <UserProvider>
            <CartProvider>
              <ThemeProvider>
                <HeaderLayout>
                  {modal}
                  {children}
                </HeaderLayout>
                <ProgressBar />
              </ThemeProvider>
            </CartProvider>
          </UserProvider>
        </Suspense>
      </body>
    </html>
  )
}
