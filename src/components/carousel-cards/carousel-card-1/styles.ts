
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"

export const FullBannerWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  overflow: "hidden",
  borderRadius: 20,
  // Force a compositing layer + mask so the rounded corners stay clipped during
  // the carousel's transform animation (otherwise the right edge corners flash square).
  transform: "translateZ(0)",
  WebkitMaskImage: "-webkit-radial-gradient(white, black)",
  isolation: "isolate",

  height: "160px",

  [theme.breakpoints.up("sm")]: {
    height: "220px",
  },
  [theme.breakpoints.up("md")]: {
    height: "290px",
  },
  [theme.breakpoints.up("lg")]: {
    height: "340px",
  },

  "& img": {
    objectFit: "cover",

    objectPosition: "center",
  },
}))

export const GradientOverlay = styled("div")({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background: `
    linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 40%, transparent 70%),
    linear-gradient(to right, rgba(0,0,0,0.25) 0%, transparent 55%)
  `,
  zIndex: 1
})

export const ContentBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 36,
  left: 40,
  zIndex: 2,
  maxWidth: "60%",

  [theme.breakpoints.down("md")]: { bottom: 24, left: 24, maxWidth: "75%" },
  [theme.breakpoints.down("sm")]: { bottom: 16, left: 16, maxWidth: "88%" }
}))

export const Badge = styled("span")(({ theme }) => ({
  display: "inline-block",
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  padding: "4px 12px",
  borderRadius: 20,
  marginBottom: 10
}))
