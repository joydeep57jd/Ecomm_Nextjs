import type { ComponentProps } from "react"
import Link from "next/link"
import Box from "@mui/material/Box"
import LazyImage from "@/components/LazyImage"

// ==============================================================
interface MobileHeaderProps extends ComponentProps<typeof Box> {
  children: React.ReactNode;
}
// ==============================================================

export function MobileHeader({ children, ...props }: MobileHeaderProps) {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" {...props}>
      {children}
    </Box>
  )
}

// ==================================================================
interface MobileHeaderLeftProps extends ComponentProps<typeof Box> {
  children: React.ReactNode;
}
// ==================================================================

MobileHeader.Left = function ({ children, ...props }: MobileHeaderLeftProps) {
  return (
    <Box flex={1} {...props}>
      {children}
    </Box>
  )
}

MobileHeader.Logo = function ({ logoUrl }: { logoUrl: string }) {
  return (
    <Link href="/">
      <LazyImage
        priority
        src={logoUrl}
        alt="logo"
        width={200}
        height={80}
        
       
        sx={{ objectFit: "contain",  width:"180px",height:"auto"}} />
    </Link>
  )
}

// ==================================================================
interface MobileHeaderRightProps extends ComponentProps<typeof Box> {
  children: React.ReactNode;
}
// ==================================================================

MobileHeader.Right = function ({ children, ...props }: MobileHeaderRightProps) {
  return (
    <Box display="flex" alignItems={'center'} justifyContent="end" flex={1} {...props}>
      {children}
    </Box>
  )
}
