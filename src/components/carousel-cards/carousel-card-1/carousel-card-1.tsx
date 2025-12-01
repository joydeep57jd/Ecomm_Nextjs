import { styled } from "@mui/material/styles"
import LazyImage from "components/LazyImage"

interface Props {
  title: string
  imgUrl: string
  buttonLink?: string
  buttonText?: string
  description: string
  buttonColor?: "dark" | "primary"
}

const FullBannerWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  overflow: "hidden",
  borderRadius: "inherit",

  height: "220px", 

  [theme.breakpoints.up("sm")]: {
    height: "320px", 
  },
  [theme.breakpoints.up("md")]: {
    height: "420px", 
  },
  [theme.breakpoints.up("lg")]: {
    height: "500px", 
  },

  "& img": {
    // objectFit: "cover",
    objectFit: "contain",   
    objectPosition: "center",
  },
}))

export default function CarouselCard1({ title, imgUrl }: Props) {
  return (
    <FullBannerWrapper>
      <LazyImage
        fill
        src={imgUrl}
        alt={title}
        sizes="100vw"
        priority
      />
    </FullBannerWrapper>
  )
}
