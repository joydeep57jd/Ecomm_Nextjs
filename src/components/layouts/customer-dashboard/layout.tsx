'use client'
import { useEffect, type PropsWithChildren } from "react"
// MUI
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"
// LOCAL CUSTOM COMPONENTS
import { Navigation } from "./navigation"
import { useUser } from "@/contexts/UserContenxt"
import { useRouter } from "next/navigation"

const gridStyle = {
  display: {
    xs: "none",
    lg: "block"
  }
}

export default function CustomerDashboardLayout({ children }: PropsWithChildren) {
  const { user } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [])

  return (
    <Box bgcolor="grey.50" py={{ xs: 3, sm: 4 }}>
      <Container>
        <Grid container spacing={3}>
          <Grid size={{ lg: 3, xs: 12 }} sx={gridStyle}>
            <Navigation />
          </Grid>

          <Grid size={{ lg: 9, xs: 12 }}>{!!user && children}</Grid>
        </Grid>
      </Container>
    </Box>
  )
}
