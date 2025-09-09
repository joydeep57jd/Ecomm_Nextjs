import type { ReactNode } from "react"
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
        <CartProvider>
          <ThemeProvider>
            {modal}
            {children}
            <ProgressBar />
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  )
}
