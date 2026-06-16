import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import ListItem from "../checkout/checkout-summery/list-item"
import { useMemo } from "react"
import { useUser } from "@/contexts/UserContenxt"
import { useRouter } from "next/navigation"
import { Cart } from "@/models/CartProductItem.models"

type Props = {
  cartItems: Cart[]
}

export default function CheckoutForm({ cartItems }: Props) {
  const { user } = useUser()
  const router = useRouter()

  const inStockItems = useMemo(() => cartItems.filter(item => !item.isOutOfStock), [cartItems])
  const outOfStockCount = cartItems.length - inStockItems.length

  const priceDetails = useMemo(() => {
    return inStockItems.reduce(
      (acc, item) => {
        const totalMrp = item.mrp * item.qty
        const totalActual = item.productPrice * item.qty
        acc.mrp += totalMrp
        acc.totalPrice += totalActual
        acc.discount += totalMrp - totalActual
        return acc
      },
      { mrp: 0, discount: 0, totalPrice: 0 }
    )
  }, [inStockItems])

  const checkOut = () => {
    if (!inStockItems.length) return
    router.push(user ? `/checkout?businessUnitId=${cartItems[0].businessUnitId}` : "/login")
  }

  return (
    <Card
      elevation={0}
      sx={{
        padding: 3,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "grey.50"
      }}
    >
      {outOfStockCount > 0 && (
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            px: 1.5,
            py: 1,
            color: "error.main",
            bgcolor: "rgba(211,47,47,0.08)",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "rgba(211,47,47,0.3)"
          }}
        >
          {outOfStockCount} item{outOfStockCount > 1 ? "s are" : " is"} out of stock and excluded from the total.
        </Typography>
      )}

      <ListItem title={`Price (${inStockItems.length})`} value={priceDetails.mrp} />
      <ListItem title="Discount" value={priceDetails.discount} />
      <ListItem title="Total Amount" value={priceDetails.totalPrice} />

      <Button
        fullWidth
        color="primary"
        variant="contained"
        sx={{ mt: 2 }}
        onClick={checkOut}
        disabled={!inStockItems.length}
      >
        Checkout Now
      </Button>
    </Card>
  )
}
