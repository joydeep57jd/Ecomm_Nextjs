import Link from "next/link"
// MUI
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
// CUSTOM COMPONENTS
import Pencil from "icons/Pencil"
import TableRow from "../table-row"
import DeleteAddressBtn from "./delete-btn"
import { DelivaryAddressData } from "@/models/Address.model"
// CUSTOM DATA MODEL

// ==============================================================
type Props = { address: DelivaryAddressData };
// ==============================================================

export default function AddressListItem({ address }: Props) {
  return (
    <Link href={`/address/${address.customer.addrid}`}>
      <TableRow elevation={0}>
        <Typography noWrap fontWeight={500} variant="body1">
          {address.customer.fname}
        </Typography>

        <Typography noWrap variant="body1">
          {`${address.customer.address1}, ${address.customer.city}`}
        </Typography>

        <Typography noWrap variant="body1">
          {address.customer.phone}
        </Typography>

        <Typography noWrap variant="body1" color="text.secondary" textAlign="right">
          <IconButton>
            <Pencil fontSize="small" color="inherit" />
          </IconButton>

          <DeleteAddressBtn id={address.customer.addrid.toString()} />
        </Typography>
      </TableRow>
    </Link>
  )
}
