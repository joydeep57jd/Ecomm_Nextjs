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


import Container from "components/Container"
import CarouselCard1 from "components/carousel-cards/carousel-card-1"
// LOCAL CUSTOM COMPONENT
import CarouselBanner from "./carousel-banner"
// API FUNCTIONS
import api from "utils/__api__/market-1"

export default async function Section1() {
  const carouselData = await api.getMainCarousel()
  if (!carouselData || carouselData.length === 0) return null

  return (
    <Container>
      <CarouselBanner>
        {carouselData.map((item, ind) => (
          <CarouselCard1
            key={ind}
            title={item.title!}
            imgUrl={item.imgUrl!}
            buttonLink={item.buttonLink!}
            buttonText={item.buttonText!}
            description={item.description!}
          />
        ))}
      </CarouselBanner>
    </Container>
  )
}

