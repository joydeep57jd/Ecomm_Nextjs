import { Fragment } from "react"
// CUSTOM COMPONENT
import Location from "icons/Location"
import Pagination from "../../pagination"
import AddressListItem from "../address-item"
import DashboardHeader from "../../dashboard-header"
import { DelivaryAddressData } from "@/models/Address.model"
// CUSTOM DATA MODEL

// =======================================================
interface Props {
  totalPages: number;
  addresses: DelivaryAddressData[];
}
// =======================================================

export function AddressPageView({ addresses, totalPages }: Props) {
  return (
    <Fragment>
      <DashboardHeader Icon={Location} title="My Addresses" />

      {addresses.map((address) => (
        <AddressListItem key={address.customer.addrid} address={address} />
      ))}

      <Pagination count={totalPages} />
    </Fragment>
  )
}
