/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Fragment, PropsWithChildren } from "react"
import Link from "next/link"
import Image from "next/image"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
// GLOBAL CUSTOM COMPONENTS
import {
  Footer1,
  FooterApps,
  FooterContact,
  FooterLinksWidget,
  FooterSocialLinks
} from "components/footer"
import Sticky from "components/sticky"
import { NavigationList } from "components/navbar"
// import { CategoryList } from "components/categories"
import { MobileMenu } from "components/mobile-navbar"
import { SecondaryHeader } from "components/secondary-header"
import { MobileNavigationBar } from "components/mobile-navigation"
import { SearchInput1, SearchInput2 } from "components/search-box"
import { Topbar, TopbarSocialLinks } from "components/topbar"
import { Header, HeaderCart, HeaderLogin, MobileHeader, HeaderSearch } from "components/header"
// CUSTOM DATA MODEL
import LayoutModel from "models/Layout.model"
import { Box } from "@mui/material"


// ==============================================================
interface Props extends PropsWithChildren {
  data: LayoutModel
  
}
// ==============================================================

export default function ShopLayout1({ children, data }: Props) {
  const { footer, header, topbar, mobileNavigation } = data
    const footerDetails = footer!.about[0]
    

 const aboutLinks = [
  { title: footerDetails?.aboutUsDtl?.aboutUs, url: "#" },
  { title: footerDetails?.contactUsDtl?.contactUs, url: "#" },
  { title: footerDetails?.privacyPolicyDtl?.privacyPolicy, url: "#" },
  { title: footerDetails?.termsAndConditionsDtl?.termsAndConditions, url: "#" },
  { title: footerDetails?.cancellation_RefundPolicyDtl?.cancellation_RefundPolicy, url: "#" },
  { title: footerDetails?.returnPolicyDtl?.returnPolicy, url: "#" },
  { title: footerDetails?.tradeLicenseDtl?.tradeLicenseNo, url: "#" },
  { title: footerDetails?.tinNoDtl?.tinNo, url: "#" }
].filter(item => item.title)

  const MOBILE_VERSION_HEADER = (
    <MobileHeader>
      <MobileHeader.Left>
        {header && <MobileMenu navigation={header.navigation} />}
      </MobileHeader.Left>

      {mobileNavigation && <MobileHeader.Logo logoUrl={header?.logo ?? ""} />}

      <MobileHeader.Right>
        <HeaderSearch />
        <HeaderLogin />
        <HeaderCart />
      </MobileHeader.Right>
    </MobileHeader>
  )

  return (
    <Fragment>
      <Topbar>
        <Topbar.Left label={topbar?.label ?? ""} title={topbar?.title ?? ""} />

        <Topbar.Right>
          <TopbarSocialLinks links={topbar?.socials ?? {}} />
        </Topbar.Right>
      </Topbar>

      <Sticky fixedOn={0} scrollDistance={300}>
        {header && (
          <Header mobileHeader={MOBILE_VERSION_HEADER}>
            <Header.Left>
              <Header.Logo url={header.logo} />
            </Header.Left>

            <Header.Mid>
              <NavigationList navigation={header.navigation} layoutModel={data} />
            </Header.Mid>

            <Header.Right>
              <Box display="flex" alignItems="center">
                <HeaderLogin />
                <HeaderCart />
              </Box>
            </Header.Right>
          </Header>
        )}
      </Sticky>

      <SecondaryHeader elevation={0}>
        {/* <SecondaryHeader.Left>
          <CategoryList categories={header.categoryMenus} />
        </SecondaryHeader.Left> */}

        <SecondaryHeader.Right>
          <SearchInput1 categories={header!.categories} />
        </SecondaryHeader.Right>
      </SecondaryHeader>
      <div
        style={{
          minHeight: "calc(100vh - 539px)"
        }}
      >
        {children}
      </div>

      {/* {
        mobileNavigation &&
        <MobileNavigationBar navigation={mobileNavigation.version1} />
      } */}
      {
        
      }
      

      {footer && (
        <Footer1>
          <Footer1.Brand>
            <Link href="/">
              <Image
                src={footer.logo}
                alt="logo"
                width={200}
                height={10}
                style={{ objectFit: "contain", height: "auto", width: "auto" }}
              />
            </Link>

            <Typography
              variant="body1"
              sx={{ mt: 1, mb: 3, maxWidth: 370, color: "white", lineHeight: 1.7 }}
            >
              {footer.description}
            </Typography>

            {/* <FooterApps playStoreUrl={footer.playStoreUrl} appleStoreUrl={footer.appStoreUrl} /> */}
          </Footer1.Brand>
          <Footer1.Widget1>
            <FooterLinksWidget title="About Us" links={aboutLinks} />
          </Footer1.Widget1>

          <Footer1.Widget2>
            <FooterLinksWidget title="Customer Care" links={footer.customers} />
          </Footer1.Widget2>

          {footer?.contact && footer?.socials && (
            <Footer1.Contact>
              <FooterContact
                phone={footer?.contact?.phone ?? ""}
                email={footer?.contact?.email ?? ""}
                address={{
                  ...(footer?.contact?.address ?? {}),
                  address2: footer?.contact?.address?.address2 ?? ""
                }}
              />

              <FooterSocialLinks links={footer?.socials} />
            </Footer1.Contact>
          )}

          <Footer1.Copyright>
            <Divider sx={{ borderColor: "grey.800" }} />

            <Typography
              variant="body2"
              sx={{ py: 3, textAlign: "center", span: { fontWeight: 500 } }}
            >
              &copy; Copyright {new Date().getFullYear()} , Powered by{" "}
              <span> Wizard Communications Pvt Ltd..</span>
            </Typography>
          </Footer1.Copyright>
        </Footer1>
      )}
    </Fragment>
  )
}
