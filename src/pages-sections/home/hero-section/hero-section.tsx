// "use client"

// import Container from "components/Container"
// import CarouselCard1 from "components/carousel-cards/carousel-card-1"
// // LOCAL CUSTOM COMPONENT
// import CarouselBanner from "./carousel-banner"
// // API FUNCTIONS
// import { HomeAPI } from "@/utils/api"
// import { useEffect, useState } from "react"

// type HeroSectionItem = {
//   responseSectionItemAndImage?: {
//     sectionItems?: {
//       images?: { fullImagepath?: string; alt?: string }[]
//     }[]
//   }
// }

// export default function HeroSection() {

//   const [heroSections, setHeroSections] = useState<HeroSectionItem[]>([])

//   useEffect(() => {
//     getHeroSections()
//   }, [])

//   const getHeroSections = async () => {
//     try {
//       const { data } = await HomeAPI.homePage()
//       setHeroSections(data.responseCompanyTemplateSections)
//     } catch (error) {
//       console.error("Error fetching hero sections:", error)
//     }
//   }

//   const carouselData = heroSections.map(section => {
//     const firstItem = section.responseSectionItemAndImage?.sectionItems?.[0]

//     if (!firstItem) return null

//     const imgUrl = firstItem.images?.[0]?.fullImagepath

//     return imgUrl ? { imgUrl, alt: firstItem.images?.[0]?.alt } : null
//   }).filter(Boolean)

//   if (carouselData.length === 0) return null

//   return (
//     <Container>
//       <CarouselBanner>
//         {carouselData.map((item, ind) => (
//           <CarouselCard1 key={ind} imgUrl={item!.imgUrl} />
//         ))}
//       </CarouselBanner>
//     </Container>
//   )
// }

// import Container from "components/Container"
// import CarouselBanner from "./carousel-banner"
// import { Section } from "@/models/Home.model"
// import CarouselCard1 from "@/components/carousel-cards/carousel-card-1"
// import { BannerOfferResponse } from "@/models/Offer.model"

// type bannerSectionProps = {
//   bannerSection: Section[]
//   offerData: BannerOfferResponse[] | null
// }



// export default function HeroSection({ bannerSection, offerData }: bannerSectionProps) {
//   // If offer data exists, show offer banners
//   if (offerData && offerData.length > 0) {
//     // console.warn("Using offer data for hero section:", offerData)
//     return (
//       <Container>
//         <CarouselBanner>
//           {offerData?.map((offer) => (
//             <CarouselCard1
//               key={offer.offerId}
//               imgUrl={offer.bannerImageUrl}
//               title={offer.offerName}
//               buttonLink=""
//               buttonText=""
//               description={`${offer.discountPercentage}% Off`}
//             />
//           ))}
//         </CarouselBanner>
//       </Container>
//     )
//   }

//   // Fallback to bannerSections only when offerData is null
//   if (!bannerSection?.length) return null

//   return (
//     <Container>
//       <CarouselBanner>
//         {bannerSection[0].responseSectionItemAndImage?.sectionItems?.map((item, ind) => (
//           <CarouselCard1
//             key={ind}
//             title={item.name}
//             imgUrl={item.images?.[0]?.fullImagepath!}
//             buttonLink=""
//             buttonText=""
//             description=""
//           />
//         ))}
//       </CarouselBanner>
//     </Container>
//   )
// }



import Container from "components/Container"
import CarouselBanner from "./carousel-banner"
import { Section } from "@/models/Home.model"
import CarouselCard1 from "@/components/carousel-cards/carousel-card-1"
import { BannerOfferResponse } from "@/models/Offer.model"
import Box from "@mui/material/Box"
import Link from "next/link"

type bannerSectionProps = {
  bannerSection: Section[]
  offerData: BannerOfferResponse[] | null
}

export default function HeroSection({ bannerSection, offerData }: bannerSectionProps) {
  const hasOffer = offerData && offerData.length > 0
  const hasBanner = bannerSection && bannerSection.length > 0 &&
    bannerSection[0].responseSectionItemAndImage?.sectionItems?.length

  if (!hasOffer && !hasBanner) return null

  return (
    <Container>
      <Box display="flex" flexDirection="column" gap={3}>

       

        {hasBanner && (
          <CarouselBanner>
            {bannerSection[0].responseSectionItemAndImage?.sectionItems?.map((item, ind) => (
              <CarouselCard1
                key={ind}
                title={item.name}
                imgUrl={item.images?.[0]?.fullImagepath!}
                buttonLink=""
                buttonText=""
                description=""
              />
            ))}
          </CarouselBanner>
        )}

         {hasOffer && (
          <CarouselBanner>
            {offerData.map((offer) => (
              <Link key={offer.offerId} href={`/sales/${btoa(offer.offerId.toString())}`} style={{ display: "block" }}>
                <CarouselCard1
                  imgUrl={offer.bannerImageUrl}
                  title={offer.offerName}
                  buttonLink=""
                  buttonText=""
                  description={`${offer.discountPercentage}% Off`}
                />
              </Link>
            ))}
          </CarouselBanner>
        )}

      </Box>
    </Container>
  )
}

