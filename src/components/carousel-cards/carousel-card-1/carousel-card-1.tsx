import LazyImage from "@/components/LazyImage"
import Typography from "@mui/material/Typography"
import { FullBannerWrapper, GradientOverlay, ContentBox, Badge } from "./styles"

interface Props {
  title: string
  imgUrl: string
  buttonLink?: string
  buttonText?: string
  description?: string
  buttonColor?: "dark" | "primary"
}

export default function CarouselCard1({ title, imgUrl, description }: Props) {
  if (!imgUrl) return null

  const hasContent = !!title || !!description
  const isDiscount = !!description && /off|%/i.test(description)

  return (
    <FullBannerWrapper>
      <LazyImage fill src={imgUrl} alt={title || "banner"} sizes="100vw" priority unoptimized />

      {hasContent && <GradientOverlay />}

      {hasContent && (
        <ContentBox>
          {isDiscount && <Badge>{description}</Badge>}

          {title && (
            <Typography
              component="h2"
              sx={{
                color: "#fff",
                fontWeight: 800,
                lineHeight: 1.2,
                textShadow: "0 2px 12px rgba(0,0,0,0.45)",
                fontSize: { xs: "1rem", sm: "1.3rem", md: "1.65rem", lg: "1.9rem" },
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {title}
            </Typography>
          )}

          {!isDiscount && description && (
            <Typography
              sx={{
                color: "rgba(255,255,255,0.9)",
                mt: 0.5,
                textShadow: "0 1px 6px rgba(0,0,0,0.45)",
                fontSize: { xs: "0.78rem", sm: "0.92rem", md: "1rem" },
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {description}
            </Typography>
          )}
        </ContentBox>
      )}
    </FullBannerWrapper>
  )
}
