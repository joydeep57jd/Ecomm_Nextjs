import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import ListItem from "../checkout/checkout-summery/list-item"
import { useEffect, useState } from "react"
import { useUser } from "@/contexts/UserContenxt"
import { useRouter } from "next/navigation"
import { Cart } from "@/models/CartProductItem.models"

type PriceDetails = {
  mrp: number
  discount: number
  totalPrice: number
}

type Props = {
  cartItems: Cart[]
}

export default function CheckoutForm({ cartItems }: Props) {
  const { user } = useUser()
  const router = useRouter()

  const [priceDetails, setPriceDetails] = useState<PriceDetails>({
    mrp: 0,
    discount: 0,
    totalPrice: 0
  })

  useEffect(() => {
    const details = cartItems.reduce(
      (acc, item) => {
        const qty = item.qty
        const mrp = item.mrp
        const price = item.productPrice

        const totalMrp = mrp * qty
        const totalActual = price * qty

        acc.mrp += totalMrp
        acc.totalPrice += totalActual
        acc.discount += totalMrp - totalActual

        return acc
      },
      { mrp: 0, discount: 0, totalPrice: 0 }
    )

    setPriceDetails(details)
  }, [cartItems])

  const checkOut = () => {
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
      <ListItem title={`Price (${cartItems.length})`} value={priceDetails.mrp} />
      <ListItem title="Discount" value={priceDetails.discount} />
      <ListItem title="Total Amount" value={priceDetails.totalPrice} />

      <Button
        fullWidth
        color="primary"
        variant="contained"
        sx={{ mt: 2 }}
        onClick={checkOut}
      >
        Checkout Now
      </Button>
    </Card>
  )
}
