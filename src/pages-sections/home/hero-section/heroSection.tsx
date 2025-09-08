
import Container from "components/Container"
import CarouselCard1 from "components/carousel-cards/carousel-card-1"
// LOCAL CUSTOM COMPONENT
import CarouselBanner from "./carousel-banner"
// API FUNCTIONS
import { HomeAPI } from "@/utils/api"

type CarouselDataItem = {
  imgUrl: string
}

export default async function HeroSection() {
  const res = await HomeAPI.homePage(1)

  // Extract only the first image from each section
  const carouselData: CarouselDataItem[] = res.data.responseCompanyTemplateSections
    .map(
      (section: {
        responseSectionItemAndImage?: {
          sectionItems?: {
            images?: { fullImagepath?: string; alt?: string }[]
          }[]
        }
      }) => {
        const firstItem = section.responseSectionItemAndImage?.sectionItems?.[0]

        if (!firstItem) return null

        const imgUrl = firstItem.images?.[0]?.fullImagepath

        return imgUrl
          ? {
              imgUrl,
              alt: firstItem.images?.[0]?.alt
            }
          : null
      }
    )
    .filter(Boolean)

  if (carouselData.length === 0) return null

  return (
    <Container>
      <CarouselBanner>
        {carouselData.map((item, ind) => (
          <CarouselCard1 key={ind} imgUrl={item.imgUrl} />
        ))}
      </CarouselBanner>
    </Container>
  )
}
