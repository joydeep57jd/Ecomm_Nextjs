"use client"

import { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import IconComponent from "components/IconComponent"
import api from "utils/__api__/market-1"
import Service from "@/models/Service.model"

export default function Section9() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    api.getServiceList().then((data) => {
      if (data) setServices(data)
    })
  }, [])

  if (!services.length) return null

  return (
    <Box bgcolor="grey.50" py={5}>
      <Container>
        <Grid container spacing={{ xs: 4, sm: 3 }}>
          {services.map(({ icon, title, id }) => (
            <Grid size={{ lg: 3, sm: 3, xs: 12 }} key={id}>
              <Box
                sx={{
                  gap: "1rem",
                  height: "100%",
                  display: "flex",
                  borderRadius: 3,
                  alignItems: "center",
                  justifyContent: { lg: "center", xs: "flex-start" }
                }}
              >
                <IconComponent icon={icon} sx={{ fontSize: "1.75rem" }} />

                <Typography noWrap variant="h4" fontSize={{ md: 20, xs: 18 }}>
                  {title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
