"use client"

import type { PropsWithChildren } from "react"
import Link from "next/link"
// MUI
import Box from "@mui/material/Box"
import SvgIcon from "@mui/material/SvgIcon"
import Typography from "@mui/material/Typography"
import ButtonBase from "@mui/material/ButtonBase"
import ArrowForward from "@mui/icons-material/ArrowForward"
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
  marginTop: "0.75rem",
  ".buttons-container": {
    gap: 8,
    display: "flex",
    alignItems: "center"
  }
}))

const StyledButtonBase = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "disabled"
})<{ active?: boolean; disabled?: boolean }>(({ theme, disabled }) => ({
  width: 34,
  height: 34,
  borderRadius: "50%",
  color: theme.palette.grey[700],
  border: `1px solid ${theme.palette.grey[300]}`,
  backgroundColor: theme.palette.common.white,
  transition: theme.transitions.create(["background-color", "color", "border-color"], {
    duration: 200
  }),
  ":hover": {
    backgroundColor: theme.palette.grey[100]
  },
  ...(disabled && {
    pointerEvents: "none",
    opacity: 0.4,
    color: theme.palette.grey[400]
  })
}))

export default function ProductsCarousel({ children, title }: ProductsCarouselProps) {
  const { ref, api, arrows, options } = useCarousel({
    align: "start",
    slideSpacing: "24px",
    slidesToShow: { xs: 1, sm: 2, md: 3, lg: 5 }
  })

  const hasSlides = !!children && Array.isArray(children) && children.length > 0
  const isStart = api?.canScrollPrev ? !api.canScrollPrev() : true
  const isEnd = api?.canScrollNext ? !api.canScrollNext() : true

  return (
    <Box position="relative">
      <Heading>
        <Typography variant="h2" fontWeight={800} fontSize={{ sm: 24, xs: 19 }}>
          {title}
        </Typography>


        {hasSlides && (
          <div className="buttons-container">
            <Typography
              component={Link}
              href="/products/search"
              variant="body2"
              fontWeight={600}
              sx={{
                mr: 0.5,
                gap: 0.4,
                display: "inline-flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                color: "orange.dark",
                textDecoration: "none",
                transition: "color 150ms ease-in-out",
                ":hover": { color: "orange.main", textDecoration: "underline" }
              }}
            >
              View all
              <ArrowForward sx={{ fontSize: 16 }} />
            </Typography>

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
