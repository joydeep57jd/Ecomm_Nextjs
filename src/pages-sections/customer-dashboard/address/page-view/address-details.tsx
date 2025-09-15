import { Fragment } from "react"
import Card from "@mui/material/Card"
// CUSTOM COMPONENT
import AddressForm from "../address-form"
import DashboardHeader from "../../dashboard-header"
import { DelivaryAddressData } from "@/models/Address.model"
// CUSTOM DATA MODEL

// =============================================================
type Props = { address: DelivaryAddressData };
// =============================================================

export function AddressDetailsPageView({ address }: Props) {
  return (
    <Fragment>
      <DashboardHeader href="/address" title="Edit Address" />

      <Card sx={{ padding: { xs: 3, sm: 4 } }}>
        <AddressForm address={address} />
      </Card>
    </Fragment>
  )
}
