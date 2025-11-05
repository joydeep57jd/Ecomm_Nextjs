import Link from "next/link"
import { format } from "date-fns/format"
// MUI
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import East from "@mui/icons-material/East"
// LOCAL CUSTOM COMPONENT
import TableRow from "../table-row"
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib"
// CUSTOM DATA MODEL
import { OrderListCustomer } from "@/models/OrderHistory.modal"
import Image from "next/image"
import { OrderStatus } from "@/enums/order-status.enum"


// =================================================
type Props = { order: OrderListCustomer };
// =================================================

const getColor = (status: string) => {
  if (status === OrderStatus.PENDING) return "secondary"
  else if (status === OrderStatus.PROCESSED) return "info"
  else if (status === OrderStatus.DELIVERED) return "success"
  else if (status === OrderStatus.PARTIALLY_DELIVERED) return "warning"
  else if (status === OrderStatus.CANCELLED) return "error"
  else return "default"
}

export default function OrderRow({ order }: Props) {
 const items = order.items ?? []
  const firstItem = items[0]
  
  return (
     <Link href={`/orders/details?id=${btoa(order.custOrdNo)}`}>
      <TableRow elevation={0} sx={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Image
              alt="Logo"
              width={40}
              height={40}
              src={firstItem?.imageName }
              style={{ marginLeft: 8, borderRadius: '100%' }}
            />

            {items.length > 1 && (
              <Typography noWrap variant="h5">
                +{items.length - 1}
              </Typography>
            )}
          </Box>

          <Typography noWrap variant="h5">
            #{order.custOrdNo}
          </Typography>
        </Box>

        <Box textAlign={{ sm: "center", xs: "right" }}>
          <Chip size="small" label={order.orderStatus} color={getColor(order.orderStatus)} />
        </Box>

        <Typography noWrap variant="body1" sx={{ textAlign: { sm: "center", xs: "left" } }}>
          {format(new Date(order.orderDate), "MMM dd, yyyy")}
        </Typography>

        <Typography
          variant="body1"
          fontWeight={500}
          sx={{ textAlign: { sm: "center", xs: "right" } }}
        >
          {currency(+order.total)}
        </Typography>

        <Box justifyContent="end" display={{ sm: "inline-flex", xs: "none" }}>
          <IconButton>
            <East className="east" fontSize="small" />
          </IconButton>
        </Box>
      </TableRow>
    </Link>
  )
}

