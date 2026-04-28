"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined"
import { BannerOfferResponse } from "@/models/Offer.model"
import Discount from "@/components/product-cards/product-card-17/discount"
import { getOfferData } from "@/utils/api/offer"
import Loading from "@/app/loading"

export default function OfferListPageView() {
  const router = useRouter()
  const [offers, setOffers] = useState<BannerOfferResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOfferData()
      .then((data) => setOffers(data ?? []))
      .finally(() => setLoading(false))
  }, [])

  const handleCardClick = (offerId: number) => {
    const encoded = encodeURIComponent(Buffer.from(offerId.toString()).toString("base64"))
    router.push(`/sales/${encoded}`)
  }

  if (loading) {
    return (
      <div style={{ position: "absolute", zIndex: 9, width: "100%" }}>
        <Loading isTiny={true} />
      </div>
    )
  }

  if (!offers || offers.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
        bgcolor="grey.50"
        px={2}
      >
        <Box textAlign="center">
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              bgcolor: "error.50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              border: "6px solid",
              borderColor: "error.100"
            }}
          >
            <LocalOfferOutlinedIcon sx={{ fontSize: 40, color: "error.main" }} />
          </Box>
          <Typography variant="h5" fontWeight={700} mb={1}>
            No Active Offers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for exciting deals and promotions!
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} mb={0.5}>
        All Offers
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        {offers.length} active offer{offers.length > 1 ? "s" : ""} available
      </Typography>

      <Grid container spacing={3}>
        {offers.map((offer) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={offer.offerId}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 3,
                overflow: "hidden",
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 6 }
              }}
            >
              <CardActionArea
                onClick={() => handleCardClick(offer.offerId)}
                sx={{ height: "100%" }}
              >
                {/* Banner Image */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 180,
                    bgcolor: "grey.100",
                    overflow: "hidden"
                  }}
                >
                  {offer.bannerImageUrl ? (
                    <Box
                      component="img"
                      src={offer.bannerImageUrl}
                      alt={offer.offerName}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                      <LocalOfferOutlinedIcon sx={{ fontSize: 48, color: "grey.400" }} />
                    </Box>
                  )}

                  {/* Discount Badge */}
                  {offer.discountPercentage > 0 && <Discount discount={offer.discountPercentage} />}
                </Box>

                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {offer.offerName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tap to explore products →
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
