"use client"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"
// LOCAL CUSTOM COMPONENTS
import CheckoutForm from "../checkout-form"
import CheckoutSummery from "../checkout-summery"
// API FUNCTIONS
import { useUser } from "@/contexts/UserContenxt"
import useCart from "@/hooks/useCart"
import { CheckoutOrderRequest, CheckoutOrderResponse } from "@/models/Order.model"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAddressList } from "@/utils/api/profile"
import { UserAddressListResponse } from "@/models/User.model"
import { getDeliveryCharge, getOrderSummary } from "@/utils/api/order"
import Loading from "@/app/loading"

export default function CheckoutAlternativePageView() {

  const [addressListResponse, setAddressListResponse] = useState<UserAddressListResponse | null>(null)
  const [checkoutOrderResponse, setCheckoutOrderResponse] = useState<CheckoutOrderResponse | null>(null)
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false)
  const [selectedPinCode, setSelectedPinCode] = useState("")
  const [deliveryCharge, setDeliveryCharge] = useState(0)

  const router = useRouter()
  const { user } = useUser()

  const { state: { remoteCarts } } = useCart()

  useEffect(() => {
    if (!remoteCarts) {
      return
    }
    if (!remoteCarts.length) {
      router.push("/")
    }

    getInitialData()
  }, [remoteCarts])

  useEffect(() => {
    if (!user?.id) {
      router.push("/")
    }
  }, [user])


  const getInitialData = async () => {
    Promise.all([
      getAddresses(),
      getCheckoutOrder()
    ])
    setTimeout(() => {
      setIsInitialDataLoaded(true)
    }, 10)
  }


  const getAddresses = async () => {
    const response = await getAddressList(+user?.customerId!)
    setAddressListResponse(response)
  }

  const getCheckoutOrder = async () => {
    const checkoutOrderRequest: CheckoutOrderRequest = {
      discoutcode: "",
      ordered: {
        items: remoteCarts!.map(c => ({
          batchId: c.batchId,
          id: c.id,
          quantity: c.quantity,
          rate: c.price_regular,
          status: "order placed",
          variantid: c.variantid
        }))
      }
    }
    const response = await getOrderSummary(checkoutOrderRequest)
    setCheckoutOrderResponse(response)
  }

  const getDeliveryChargeDetails = async () => {
    const charge = await getDeliveryCharge({
      netAmount: checkoutOrderResponse!.totalamt,
      taxAmount: checkoutOrderResponse!.totaltaxamt,
      totalAmount: checkoutOrderResponse!.grandtotalamt,
      zipCode: selectedPinCode
    })
    setDeliveryCharge(+charge)
  }

  useEffect(() => {
    if (selectedPinCode) {
      getDeliveryChargeDetails()
    }
  }, [selectedPinCode])

  if (!isInitialDataLoaded) {
    return <Loading isSmallLoader={true} />
  }

  return (
    <Box bgcolor="grey.50" sx={{ py: { xs: 3, sm: 4 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid size={{ md: 8, xs: 12 }} order={{ xs: 2, md: 1 }}>
            <CheckoutForm
              // cards={cards}
              deliveryAddresses={addressListResponse?.data!}
              getAddresses={getAddresses}
              setSelectedPinCode={setSelectedPinCode}
            // deliveryTimes={deliveryTimes}
            />
          </Grid>

          <Grid size={{ md: 4, xs: 12 }} order={{ xs: 1, md: 2 }}>
            <CheckoutSummery checkoutOrderResponse={checkoutOrderResponse!} deliveryCharge={deliveryCharge} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
