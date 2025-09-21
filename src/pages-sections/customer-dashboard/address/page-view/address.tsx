import { Fragment } from "react"
// CUSTOM COMPONENT
import Location from "icons/Location"
import AddressListItem from "../address-item"
import DashboardHeader from "../../dashboard-header"
import { DelivaryAddressData } from "@/models/Address.model"
// CUSTOM DATA MODEL

// =======================================================
interface Props {
  addresses: DelivaryAddressData[];
}
// =======================================================

export function AddressPageView({ addresses }: Props) {
  return (
    <Fragment>
      <DashboardHeader Icon={Location} title="My Addresses" />
      {addresses.map((address) => (
        <AddressListItem key={address.customer.addrid} address={address} />
      ))}
    </Fragment>
  )
}
