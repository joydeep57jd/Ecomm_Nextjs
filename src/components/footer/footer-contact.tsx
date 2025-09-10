import { Fragment } from "react"
import Typography from "@mui/material/Typography"
import { Heading } from "./styles"

// ==============================================================
interface Address {
  address1: string
  address2: string
  pin: string
  state: string
  country: string
}

interface Props {
  email: string
  phone: string
  address: Address
}

// ==============================================================

export function FooterContact({ email, phone, address }: Props) {
  return (
    <Fragment>
      <Heading>Contact Us</Heading>

      <Typography variant="body1" sx={{ py: 0.6 }}>
        {address.address1}, {address.address2}, {address.state}, {address.country} - {address.pin}
      </Typography>

      <Typography variant="body1" sx={{ py: 0.6 }}>
        Email: {email}
      </Typography>

      <Typography variant="body1" sx={{ py: 0.6, mb: 2 }}>
        Phone: {phone}
      </Typography>
    </Fragment>
  )
}
