"use client"

import type { PropsWithChildren } from "react"
import AutoPlay from "embla-carousel-autoplay"
import Box from "@mui/material/Box"
// GLOBAL CUSTOM COMPONENTS
import { Carousel, useCarousel, CarouselDots } from "components/slider"

export default function CarouselBanner({ children }: PropsWithChildren) {
  const { ref, api, dots } = useCarousel({ loop: true }, [AutoPlay({ delay: 3000 })])

  return (
    <Box
      mt={4}
      borderRadius={3}
      // bgcolor="grey.50"
      position="relative"
      px={{ xs: 1, sm: 2 }}
      py={{ xs: 1, sm: 2 }}
    >
      <Carousel ref={ref} api={api} sx={{ py: { xs: 1, sm: 2 } }}>
        {children}
      </Carousel>

      <CarouselDots
        scrollSnaps={dots.scrollSnaps}
        selectedIndex={dots.selectedIndex}
        onDotButtonClick={dots.onDotButtonClick}
      />
    </Box>
  )
}
