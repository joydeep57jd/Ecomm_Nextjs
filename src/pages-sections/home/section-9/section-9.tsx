import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined"
import PaymentOutlined from "@mui/icons-material/PaymentOutlined"
import ReplayOutlined from "@mui/icons-material/ReplayOutlined"
import VerifiedOutlined from "@mui/icons-material/VerifiedOutlined"
import type { SvgIconComponent } from "@mui/icons-material"
import { BRAND } from "theme/brand"

const ITEMS: { icon: SvgIconComponent; title: string; subtitle: string }[] = [
  {
    icon: LocalShippingOutlined,
    title: "Fast local delivery",
    subtitle: "Across the Andul–Howrah belt"
  },
  {
    icon: PaymentOutlined,
    title: "Cash on Delivery",
    subtitle: "Pay when it arrives"
  },
  {
    icon: ReplayOutlined,
    title: "Easy returns",
    subtitle: "7-day return policy"
  },
  {
    icon: VerifiedOutlined,
    title: "Genuine brands",
    subtitle: "19 years of trust"
  }
]

export default function Section9() {
  return (
    <Box
      sx={{
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "grey.200",
        bgcolor: "grey.50",
        py: { xs: 2.5, sm: 3 }
      }}
    >
      <Container>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
            gap: { xs: 2, sm: 0 }
          }}
        >
          {ITEMS.map(({ icon: Icon, title, subtitle }, index) => (
            <Box
              key={title}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: { sm: 3 },
                borderRight: {
                  sm: index < ITEMS.length - 1 ? "1px solid" : "none"
                },
                borderColor: "grey.200"
              }}
            >
              <Icon sx={{ fontSize: 28, color: BRAND.primary, flexShrink: 0 }} />
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  fontSize={13}
                  lineHeight={1.3}
                  color="text.primary"
                >
                  {title}
                </Typography>
                <Typography variant="body2" fontSize={12} lineHeight={1.4} color="text.secondary">
                  {subtitle}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
