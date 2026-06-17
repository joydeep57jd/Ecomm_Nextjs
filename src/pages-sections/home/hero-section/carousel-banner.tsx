"use client"

import type { PropsWithChildren } from "react"
import AutoPlay from "embla-carousel-autoplay"
import Box from "@mui/material/Box"
// GLOBAL CUSTOM COMPONENTS
import { Carousel, useCarousel, CarouselDots, CarouselArrows } from "components/slider"

export default function CarouselBanner({ children }: PropsWithChildren) {
  const { ref, api, dots, arrows } = useCarousel({ loop: true }, [AutoPlay({ delay: 3000 })])

  const arrowSx = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.85)",
    color: "grey.900",
    ":hover": { backgroundColor: "common.white" }
  }

  return (
    <Box
      mt={2}
      position="relative"
      sx={{ "&:hover .banner-arrows": { opacity: 1 } }}
    >
      <Carousel ref={ref} api={api}>
        {children}
      </Carousel>

      <Box
        className="banner-arrows"
        sx={{ opacity: 0, transition: "opacity 200ms ease-in-out" }}
      >
        <CarouselArrows
          onClickPrev={arrows.onClickPrev}
          onClickNext={arrows.onClickNext}
          slotProps={{
            prev: { sx: { left: 12, ...arrowSx } },
            next: { sx: { right: 12, ...arrowSx } }
          }}
        />
      </Box>

      <CarouselDots
        dotColor="rgba(255,255,255,0.55)"
        activeColor="#fff"
        scrollSnaps={dots.scrollSnaps}
        selectedIndex={dots.selectedIndex}
        onDotButtonClick={dots.onDotButtonClick}
        sx={{
          position: "absolute",
          bottom: 14,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2
        }}
      />
    </Box>
  )
}
