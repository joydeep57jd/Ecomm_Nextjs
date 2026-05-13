import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

interface Props {
  returnOtp?: string
  orderOtp?: string
}

export default function OrderItemOtp({ returnOtp, orderOtp }: Props) {
  return (
    <>
      {returnOtp && (
        <Box
          sx={{
            px: 1.5,
            py: 0.75,
            bgcolor: "warning.50",
            border: "1.5px dashed",
            borderColor: "warning.main",
            borderRadius: 1.5
          }}
        >
          <Typography variant="caption" color="warning.dark" fontWeight={600}>
            Return OTP: {returnOtp}
          </Typography>
        </Box>
      )}
      {orderOtp && (
        <Box
          sx={{
            px: 1.5,
            py: 0.75,
            bgcolor: "success.50",
            border: "1.5px dashed",
            borderColor: "success.main",
            borderRadius: 1.5
          }}
        >
          <Typography variant="caption" color="success.dark" fontWeight={600}>
            OTP: {orderOtp}
          </Typography>
        </Box>
      )}
    </>
  )
}
