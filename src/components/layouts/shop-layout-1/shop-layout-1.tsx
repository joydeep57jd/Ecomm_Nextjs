/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { PropsWithChildren } from "react"
import Link from "next/link"
import Image from "next/image"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined"
import Celebration from "@mui/icons-material/Celebration"
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined"
import PhoneOutlined from "@mui/icons-material/PhoneOutlined"
import EmailOutlined from "@mui/icons-material/EmailOutlined"
import Sticky from "components/sticky"
import { NavigationList } from "components/navbar"
// import { CategoryList } from "components/categories"
import { MobileMenu } from "components/mobile-navbar"
import { SecondaryHeader } from "components/secondary-header"
// import { MobileNavigationBar } from "components/mobile-navigation"
import { SearchInput1 } from "components/search-box"
import { Topbar, TopbarSocialLinks } from "components/topbar"
import { Header, HeaderCart, HeaderLogin, MobileHeader, HeaderSearch } from "components/header"
import { AllCategoriesMenu } from "components/header/all-categories-menu"
// CUSTOM DATA MODEL
import LayoutModel from "models/Layout.model"
import { Box } from "@mui/material"
import Section9 from "@/pages-sections/home/section-9"
import { BRAND } from "theme/brand"
import { CategoriesProvider } from "@/contexts/CategoriesContext"
import { OffersProvider } from "@/contexts/OffersContext"
import { encodeId } from "@/utils/url-id"

// ==============================================================
interface Props extends PropsWithChildren {
  data: LayoutModel
}
// ==============================================================

export default function ShopLayout1({ children, data }: Props) {
  const { footer, header, topbar, mobileNavigation, offers } = data
  const footerDetails = footer!.about[0]

  // Latest 3 offers shown next to "Today's Deals" in the secondary header.
  // Each links to its sales page using the same base64(offerId) scheme as the
  // offer list / hero banner.
  const latestOffers = (offers ?? []).slice(-3).reverse()

  const policyLinks = [
    { title: footerDetails?.privacyPolicyDtl?.privacyPolicy, url: "#" },
    { title: footerDetails?.termsAndConditionsDtl?.termsAndConditions, url: "#" },
    { title: footerDetails?.returnPolicyDtl?.returnPolicy, url: "#" },
    { title: footerDetails?.cancellation_RefundPolicyDtl?.cancellation_RefundPolicy, url: "#" }
  ].filter((item) => item.title) as { title: string; url: string }[]

  // Latest 4 categories (most recent first) from the live category data,
  // followed by the Today's Deals link that opens the sales page.
  const shopLinks = [
    ...(header?.navigation ?? [])
      .slice(-4)
      .reverse()
      .map((category) => ({
        title: category.name,
        url: `/products/search?category=${encodeId(category.id)}`
      })),
    { title: "Today's Deals", url: "/sales" }
  ]

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
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
              <Box flexGrow={1} maxWidth={920} mx={{ xs: 2, md: 4 }} sx={{ borderRadius: "50%" }}>
                <SearchInput1 categories={header.categories} />
              </Box>
            </Header.Mid>

            <Header.Right>
              <Box display="flex" alignItems="center" gap={2.5}>
                <HeaderLogin />
                <HeaderCart />
              </Box>
            </Header.Right>
          </Header>
        )}

        {header && (
          <SecondaryHeader elevation={0}>
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              width="100%"
              sx={{ flexWrap: "nowrap" }}
            >
              <AllCategoriesMenu categories={header.navigation} />

              <NavigationList navigation={header.navigation.slice(0, 3)} layoutModel={data} />

              <Divider
                orientation="vertical"
                sx={{ height: 22, alignSelf: "center", borderColor: "grey.300", flexShrink: 0 }}
              />

              <Box display="flex" alignItems="center" gap={0.5} sx={{ flexShrink: 0 }}>
                <Box
                  component={Link}
                  href="/sales"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    px: 1,
                    py: 0.75,
                    borderRadius: 1,
                    fontWeight: 500,
                    fontSize: 14,
                    color: "inherit",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "background-color 150ms ease-in-out",
                    "&:hover": { backgroundColor: "action.hover" }
                  }}
                >
                  <LocalOfferOutlined sx={{ fontSize: 18, color: BRAND.primaryDark }} />
                  Today&apos;s Deals
                </Box>

                {latestOffers.map((offer) => (
                  <Box
                    key={offer.offerId}
                    component={Link}
                    href={`/sales/${Buffer.from(offer.offerId.toString()).toString("base64")}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      px: 1,
                      py: 0.75,
                      borderRadius: 1,
                      fontWeight: 500,
                      fontSize: 14,
                      color: "inherit",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      transition: "background-color 150ms ease-in-out",
                      "&:hover": { backgroundColor: "action.hover" }
                    }}
                  >
                    {offer.offerIconUrl ? (
                      <Image
                        src={offer.offerIconUrl}
                        alt={offer.offerName}
                        width={18}
                        height={18}
                        style={{ objectFit: "contain" }}
                        unoptimized
                      />
                    ) : (
                      <Celebration sx={{ fontSize: 18, color: "primary.main" }} />
                    )}
                    {offer.offerName}
                  </Box>
                ))}
              </Box>
            </Box>
          </SecondaryHeader>
        )}
      </Sticky>

      <Box component="main" sx={{ flex: 1, bgcolor: "background.default" }}>
        <CategoriesProvider categories={header?.navigation ?? []}>
          <OffersProvider offers={offers ?? []}>{children}</OffersProvider>
        </CategoriesProvider>
      </Box>

      <Section9 />

      {footer && (
        <Box
          component="footer"
          sx={{
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "grey.200",
            pt: { xs: 3, sm: 4 }
          }}
        >
          <Container>
            <Grid container spacing={4}>
              {/* Brand */}
              <Grid size={{ lg: 4, sm: 6, xs: 12 }}>
                <Link href="/">
                  <Image
                    src={footer.logo}
                    alt="logo"
                    width={180}
                    height={48}
                    style={{ objectFit: "contain", height: "auto", width: "auto" }}
                  />
                </Link>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    mb: 3,
                    color: "text.secondary",
                    lineHeight: 1.8,
                    fontStyle: "italic"
                  }}
                >
                  {footer.description}
                </Typography>

                {footer.contact && (
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    {footer.contact.address && (
                      <Box display="flex" alignItems="flex-start" gap={1}>
                        <LocationOnOutlined
                          sx={{ fontSize: 16, color: "text.disabled", mt: "2px" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {[
                            footer.contact.address.address1,
                            footer.contact.address.address2,
                            footer.contact.address.state,
                            footer.contact.address.pin ? `— ${footer.contact.address.pin}` : ""
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </Typography>
                      </Box>
                    )}
                    {footer.contact.phone && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <PhoneOutlined sx={{ fontSize: 16, color: "text.disabled" }} />
                        <Typography variant="body2" color="text.secondary">
                          {footer.contact.phone}
                        </Typography>
                      </Box>
                    )}
                    {footer.contact.email && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <EmailOutlined sx={{ fontSize: 16, color: "text.disabled" }} />
                        <Typography variant="body2" color="text.secondary">
                          {footer.contact.email}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Grid>

              {/* Shop */}
              <Grid size={{ lg: 2, sm: 4, xs: 6 }}>
                <Typography fontWeight={600} fontSize={14} mb={2}>
                  Shop
                </Typography>
                <Box display="flex" flexDirection="column" gap={1.5}>
                  {shopLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.url}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        fontSize: 13,
                        textTransform: "lowercase"
                      }}
                    >
                      {link.title}
                    </Link>
                  ))}
                </Box>
              </Grid>

              {/* Help */}
              <Grid size={{ lg: 2, sm: 4, xs: 6 }}>
                <Typography fontWeight={600} fontSize={14} mb={2}>
                  Help
                </Typography>
                <Box display="flex" flexDirection="column" gap={1.5}>
                  {footer.customers.map((link) => (
                    <Link
                      key={link.title}
                      href={link.url}
                      style={{ textDecoration: "none", color: "inherit", fontSize: 13 }}
                    >
                      {link.title}
                    </Link>
                  ))}
                </Box>
              </Grid>

              {/* Policies */}
              <Grid size={{ lg: 2, sm: 4, xs: 12 }}>
                <Typography fontWeight={600} fontSize={14} mb={2}>
                  Policies
                </Typography>
                <Box display="flex" flexDirection="column" gap={1.5}>
                  {policyLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.url}
                      style={{ textDecoration: "none", color: "inherit", fontSize: 13 }}
                    >
                      {link.title}
                    </Link>
                  ))}
                </Box>
              </Grid>
            </Grid>

            {/* Bottom bar */}
            <Box
              sx={{
                mt: 6,
                py: 3,
                borderTop: "1px solid",
                borderColor: "grey.200",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 1
              }}
            >
              <Typography variant="body2" color="text.secondary">
                &copy; {new Date().getFullYear()} Super Shopping, Andul. All rights reserved.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Made for the Andul–Howrah community &middot; Notun Bochor, Notun Offer 🧡
              </Typography>
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  )
}
