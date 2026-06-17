import { Suspense, type ReactNode } from "react"
import { Plus_Jakarta_Sans, Inter } from "next/font/google"
import Script from "next/script"

export const geist = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta"
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter"
})

import "overlayscrollbars/overlayscrollbars.css"
import "./globals.css"

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
import { CircularProgress, GlobalStyles, } from "@mui/material"
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
      <body id="body" className={`${geist.variable} ${inter.variable} ${geist.className}`}>
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
                    <GlobalStyles
                      styles={{
                        ".notistack-SnackbarContainer": {
                          zIndex: 9999,
                        },
                      }}
                    />
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
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
