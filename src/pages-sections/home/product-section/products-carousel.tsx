"use client"

import type { PropsWithChildren } from "react"
// MUI
import Box from "@mui/material/Box"
import SvgIcon from "@mui/material/SvgIcon"
import Typography from "@mui/material/Typography"
import ButtonBase from "@mui/material/ButtonBase"
import { styled } from "@mui/material/styles"
// GLOBAL CUSTOM COMPONENTS
import { Carousel, useCarousel } from "components/slider"

interface ProductsCarouselProps extends PropsWithChildren {
  title: string
}

// STYLED COMPONENTS
const Heading = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "1.5rem",
  ".buttons-container": {
    gap: 8,
    display: "flex",
    alignItems: "center"
  }
}))

const StyledButtonBase = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "disabled"
})<{ active?: boolean; disabled?: boolean }>(({ theme, active, disabled }) => ({
  width: 32,
  height: 32,
  borderRadius: 8,
  transition: theme.transitions.create(["background-color", "color"], {
    duration: 200
  }),
  ...(active && {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main
  }),
  ...(!active && {
      color: theme.palette.grey[600],
    ":hover": {
      backgroundColor: theme.palette.grey[100]
    }
  }),
  ...(disabled && {
    pointerEvents: "none",
    opacity: 0.5,
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.grey[400]
  })
}))

export default function ProductsCarousel({ children, title }: ProductsCarouselProps) {
  const { ref, api, arrows, options } = useCarousel({
    align: "start",
    slideSpacing: "24px",
    slidesToShow: { xs: 1, sm: 2, md: 3, lg: 4 }
  })

  const hasSlides = !!children && Array.isArray(children) && children.length > 0
  const isStart = api?.canScrollPrev ? !api.canScrollPrev() : true
  const isEnd = api?.canScrollNext ? !api.canScrollNext() : true

  return (
    <Box position="relative">
      <Heading>
        <Typography variant="h2" fontWeight={700} fontSize={{ sm: 32, xs: 27 }}>
          {title}
        </Typography>

      
        {hasSlides && (
          <div className="buttons-container">
            {/* Prev button */}
            <StyledButtonBase
              onClick={arrows.onClickPrev}
              active={!isStart}
              disabled={isStart}
            >
              <SvgIcon>
                <path
                  fill="currentColor"
                  d="M14 17.308L8.692 12L14 6.692l.708.708l-4.6 4.6l4.6 4.6z"
                />
              </SvgIcon>
            </StyledButtonBase>

            {/* Next button */}
            <StyledButtonBase
              onClick={arrows.onClickNext}
              active={!isEnd}
              disabled={isEnd}
            >
              <SvgIcon>
                <path
                  fill="currentColor"
                  d="m13.292 12l-4.6-4.6l.708-.708L14.708 12L9.4 17.308l-.708-.708z"
                />
              </SvgIcon>
            </StyledButtonBase>
          </div>
        )}
      </Heading>

      <Carousel ref={ref} api={api} options={options}>
        {children}
      </Carousel>
    </Box>
  )
}
