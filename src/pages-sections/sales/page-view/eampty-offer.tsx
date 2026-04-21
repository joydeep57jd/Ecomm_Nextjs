"use client"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"

export default function InvalidOfferView() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      px={2}
      bgcolor="grey.50"
    >
      <Paper
        elevation={0}
        sx={{
          textAlign: "center",
          px: { xs: 3, sm: 6 },
          py: { xs: 5, sm: 7 },
          maxWidth: 480,
          width: "100%",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "grey.200"
        }}
      >
        {/* Icon Badge */}
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

        {/* Badge Label */}
        <Box
          sx={{
            display: "inline-block",
            bgcolor: "error.50",
            color: "error.main",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            px: 1.5,
            py: 0.5,
            borderRadius: 10,
            mb: 2
          }}
        >
          Offer Not Found
        </Box>

        <Typography variant="h4" fontWeight={700} color="text.primary" mb={1.5}>
          Invalid or Expired Offer
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4} lineHeight={1.7}>
          We couldn't find the offer you're looking for. The link might be broken, or the promotion
          may have ended.
        </Typography>

        {/* Divider */}
        <Box sx={{ borderTop: "1px solid", borderColor: "grey.200", mb: 4 }} />

        {/* Actions */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={1.5}
          justifyContent="center"
        >
          {/* <Button
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => router.back()}
            sx={{ borderRadius: 2, px: 3, borderColor: "grey.300", color: "text.secondary" }}
          >
            Go Back
          </Button> */}

          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeOutlinedIcon />}
            href="/"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Return to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
