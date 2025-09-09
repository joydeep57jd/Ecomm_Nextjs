import { Fragment } from "react"
// LOCAL CUSTOM COMPONENTS

import Section9 from "../section-9"
import HeroSection from "../hero-section"
import ProductSection from "../product-section"

export default function HomePageView() {
  return (
    <Fragment>
      {/* HERO SLIDER SECTION */}
      <HeroSection />

      {/* FLASH DEALS SECTION */}
      <ProductSection />


      {/* CUSTOM SOLUTIONS SECTION */}


      {/* SERVICES SECTION */}
      <Section9 />

      {/* POPUP NEWSLETTER FORM */}
      {/* <Newsletter /> */}
    </Fragment>
  )
}
