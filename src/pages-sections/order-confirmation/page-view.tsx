"use client"

import Link from "next/link"
import Image from "next/image"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
// STYLED COMPONENT
import { Wrapper, StyledButton } from "./styles"
import { PlaceOrderResponse } from "@/models/Order.model"

type Props = {
  orderResponse: PlaceOrderResponse
  onRetry?: () => void
}

export default function OrderConfirmationPageView({ orderResponse,  }: Props) {
  const isSuccess = orderResponse.status === "success" && !!orderResponse.orderNo

  if (!isSuccess) {
    return (
      <Container className="mt-2 mb-5">
        <Wrapper>
          <Box
            sx={{
              width: 116,
              height: 116,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(211,47,47,0.1)",
              margin: "0 auto"
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 72, color: "error.main" }} />
          </Box>

          <Typography variant="h1" fontWeight={700} color="error.main">
            Order could not be placed
          </Typography>

          <Typography
            fontSize={16}
            variant="body1"
            color="text.secondary"
            sx={{ padding: ".5rem 2rem" }}
          >
            {orderResponse.orderStatus ||
              "Sorry, your order could not be placed due to a technical issue. Please try again."}
          </Typography>

          <Typography fontSize={14} variant="body2" color="text.secondary">
            No payment has been taken. Your cart items are still saved.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
            <StyledButton
              color="primary"
              disableElevation
              variant="outlined"
              LinkComponent={Link}
              href="/cart"
            >
              Back to cart
            </StyledButton>
          </Box>
        </Wrapper>
      </Container>
    )
  }

  return (
    <Container className="mt-2 mb-5">
      <Wrapper>
        <Image
          width={116}
          height={116}
          alt="complete"
          src="/assets/images/illustrations/party-popper.svg"
        />

        <Typography variant="h1" fontWeight={700}>
          Thank you for your purchase!
        </Typography>

        <Typography
          fontSize={16}
          variant="body1"
          color="text.secondary"
          sx={{ padding: ".5rem 2rem" }}
        >
          We have received your order and you will be receiving confirmation email with order
          details.
        </Typography>

        <Typography fontSize={16} variant="body1" color="text.secondary">
          Your order number is <strong>#{orderResponse.orderNo}</strong>.
        </Typography>

        <StyledButton
          color="primary"
          disableElevation
          variant="contained"
          className="button-link"
          LinkComponent={Link}
          href="/"
        >
          Browse products
        </StyledButton>
      </Wrapper>
    </Container>
  )
}
