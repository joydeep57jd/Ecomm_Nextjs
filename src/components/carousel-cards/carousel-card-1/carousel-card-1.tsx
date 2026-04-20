
import { styled } from "@mui/material/styles"
import LazyImage from "@/components/LazyImage"


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
    objectFit: "cover",
  
    objectPosition: "center",
  },
}))

export default function CarouselCard1({ title, imgUrl }: Props) {
  if (!imgUrl) return null
  return (
    <FullBannerWrapper>
      <LazyImage
        fill
        src={imgUrl}
        alt={title}
        sizes="100vw"
        priority
        unoptimized
      />
    </FullBannerWrapper>
  )
}


// "use client"
// import { styled, keyframes } from "@mui/material/styles"
// import LazyImage from "@/components/LazyImage"
// import Typography from "@mui/material/Typography"
// import Box from "@mui/material/Box"

// interface Props {
//   title: string
//   imgUrl: string
//   buttonLink?: string
//   buttonText?: string
//   description?: string
//   buttonColor?: "dark" | "primary"
// }

// const fadeUp = keyframes`
//   from { opacity: 0; transform: translateY(20px); }
//   to   { opacity: 1; transform: translateY(0); }
// `

// const FullBannerWrapper = styled("div")(({ theme }) => ({
//   position: "relative",
//   width: "100%",
//   overflow: "hidden",
//   // borderRadius: 20,
//   height: "220px",
//   cursor: "pointer",

//   [theme.breakpoints.up("sm")]: { height: "320px" },
//   [theme.breakpoints.up("md")]: { height: "420px" },
//   [theme.breakpoints.up("lg")]: { height: "500px" },

//   "& img": {
//     objectFit: "cover",
//     objectPosition: "center",
//     transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
//   },
//   "&:hover img": {
//     transform: "scale(1.05)",
//   },
// }))

// const GradientOverlay = styled("div")({
//   position: "absolute",
//   inset: 0,
//   background: `
//     linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 35%, transparent 65%),
//     linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 50%)
//   `,
//   zIndex: 1,
// })

// const ContentBox = styled(Box)(({ theme }) => ({
//   position: "absolute",
//   bottom: 36,
//   left: 40,
//   zIndex: 2,
//   maxWidth: "55%",
//   animation: `${fadeUp} 0.1s ease both`,

//   [theme.breakpoints.down("md")]: { bottom: 24, left: 24, maxWidth: "70%" },
//   [theme.breakpoints.down("sm")]: { bottom: 16, left: 16, maxWidth: "85%" },
// }))

// const Badge = styled("span")(({ theme }) => ({
//   display: "inline-block",
//   background: "linear-gradient(135deg, #f97316, #ef4444)",
//   color: "#fff",
//   fontSize: "0.7rem",
//   fontWeight: 700,
//   letterSpacing: "0.1em",
//   textTransform: "uppercase",
//   padding: "4px 12px",
//   borderRadius: 20,
//   marginBottom: 10,
//   boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
// }))

// export default function CarouselCard1({ title, imgUrl, description }: Props) {
//   const hasContent = title || description

//   // extract discount % from description like "10% Off"
//   const isDiscount = description?.toLowerCase().includes("off") || description?.toLowerCase().includes("%")

//   return (
//     <FullBannerWrapper>
//       <LazyImage fill src={imgUrl} alt={title || "banner"} sizes="100vw" priority unoptimized />

//       {hasContent && <GradientOverlay />}

//       {hasContent && (
//         <ContentBox>
//           {isDiscount && description && (
//             <Badge>🔥 {description}</Badge>
//           )}

//           {title && (
//             <Typography
//               component="h2"
//               sx={{
//                 color: "#fff",
//                 fontWeight: 900,
//                 lineHeight: 1.15,
//                 letterSpacing: "-0.02em",
//                 mb: (!isDiscount && description) ? 1 : 0,
//                 textShadow: "0 2px 16px rgba(0,0,0,0.5)",
//                 fontSize: { xs: "1.3rem", sm: "1.75rem", md: "2.25rem", lg: "2.75rem" },
//               }}
//             >
//               {title}
//             </Typography>
//           )}

//           {!isDiscount && description && (
//             <Typography
//               sx={{
//                 color: "rgba(255,255,255,0.85)",
//                 fontWeight: 400,
//                 lineHeight: 1.5,
//                 textShadow: "0 1px 6px rgba(0,0,0,0.5)",
//                 fontSize: { xs: "0.78rem", sm: "0.92rem", md: "1rem" },
//                 mt: 0.5,
//                 display: "-webkit-box",
//                 WebkitLineClamp: 2,
//                 WebkitBoxOrient: "vertical",
//                 overflow: "hidden",
//               }}
//             >
//               {description}
//             </Typography>
//           )}
//         </ContentBox>
//       )}
//     </FullBannerWrapper>
//   )
// }
