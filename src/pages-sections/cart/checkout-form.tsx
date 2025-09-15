// MUI
import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import ListItem from "../checkout/checkout-summery/list-item"
import useCart from "@/hooks/useCart"
import { useEffect, useState } from "react"
import { useUser } from "@/contexts/UserContenxt"
import { useRouter } from "next/navigation"



type PriceDetails = {
  mrp: number, discount: number, totalPrice: number
}

export default function CheckoutForm() {
  const {user} = useUser()
  const router = useRouter()

  const [priceDetails, setPriceDetails] = useState<PriceDetails | null>(null)

  const { state: { cart } } = useCart()

  useEffect(() => {
    const detals = cart?.reduce((acc, cart) => {
      const mrp = cart.mrp
      const actualPrice = cart.productPrice
      const qty = cart.qty
      const totalActualPrice = +(actualPrice * qty).toFixed(2)
      const totalMrp = +(mrp * qty).toFixed(2)
      const toalDiscount = +(totalMrp - totalActualPrice).toFixed(2)

      acc.discount += toalDiscount
      acc.mrp += totalMrp
      acc.totalPrice += totalActualPrice

      return acc
    }, { mrp: 0, discount: 0, totalPrice: 0 })

    setPriceDetails(detals!)
  }, [cart])

  const checkOut =()=>{
    if(user){
      router.push("/checkout")
    }else{
      router.push("/login")
    }

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

      {/* <FlexBox alignItems="center" gap={1} my={2}>
        <TextField
          fullWidth
          size="small"
          label="Voucher"
          variant="outlined"
          placeholder="Voucher"
        />

        <Button variant="outlined" color="primary">
          Apply
        </Button>
      </FlexBox> */}

      <ListItem title={`Price (${cart?.length})`} value={priceDetails?.mrp} />
      <ListItem title="Discount" value={priceDetails?.discount} />
      <ListItem title="Total Amount" value={priceDetails?.totalPrice} />
      <Button fullWidth color="primary"   variant="contained"  sx={{ mt: 2 }} onClick={checkOut}>
        Checkout Now
      </Button>
    </Card>
  )
}
