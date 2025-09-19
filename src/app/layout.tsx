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
import SyncCart from "../components/sync-cart"
import { CartDrawerProvider } from "@/contexts/CartDrawerContext"
import MiniCartDrawer from "./@modal/(.)mini-cart/page"
import { FlexRowCenter } from "@/components/flex-box"
import { CircularProgress, } from "@mui/material"
import SnackbarProvider from "@/components/SnackbarProvider"

// ==============================================================
interface RootLayoutProps {
  children: ReactNode
  modal: ReactNode
}


// ==============================================================

export default function RootLayout({ children, modal }: RootLayoutProps) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body id="body" className={geist.className}>
        <Suspense
          fallback={
            <FlexRowCenter minHeight="100vh">
              <CircularProgress sx={{ color: "#111827" }} />
            </FlexRowCenter>
          }
        >
          <SnackbarProvider>
            <CartDrawerProvider>
              <UserProvider>
                <CartProvider>
                  <ThemeProvider>
                    <HeaderLayout>
                      <SyncCart />
                      {modal}
                      {children}
                      <MiniCartDrawer />
                    </HeaderLayout>
                    <ProgressBar />
                  </ThemeProvider>
                </CartProvider>
              </UserProvider>
            </CartDrawerProvider>
          </SnackbarProvider>
        </Suspense>
      </body>
    </html>
  )
}
