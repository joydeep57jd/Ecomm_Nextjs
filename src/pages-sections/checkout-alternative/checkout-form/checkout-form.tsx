"use client"
import { Resolver, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/material/styles"
import CreditCardIcon from "@mui/icons-material/CreditCard"
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
// import ShieldIcon from "@mui/icons-material/Shield"

import {  useState } from "react"
import { FormProvider } from "components/form-hook"
import Card from "./card"
import { Address } from "@/models/User.model"
import DeliveryAddresses from "./delivery-addresses"
import { DelivaryAddressData } from "@/models/Address.model"

const validationSchema = yup.object().shape({
  card: yup.string().optional(),
  voucher: yup.string().optional(),
  saveCard: yup.boolean().optional(),
  date: yup.string().required("Delivery date is required"),
  time: yup.string().required("Delivery time is required"),
  address: yup.string().required("Delivery address is required"),
  cardHolderName: yup.string().when("card", {
    is: (val: string) => !val,
    then: (Schema) => Schema.required("Name is required")
  }),
  cardNo: yup.string().when("card", {
    is: (val: string) => !val,
    then: (Schema) => Schema.required("Card No is required")
  }),
  cardExpiry: yup.string().when("card", {
    is: (val: string) => !val,
    then: (Schema) => Schema.required("Expiry is required")
  }),
  cardCVC: yup.string().when("card", {
    is: (val: string) => !val,
    then: (Schema) => Schema.required("CVC is required")
  })
})

type FormValues = yup.InferType<typeof validationSchema>

interface Props {
  deliveryAddresses: Address[]
  getAddresses(): Promise<void>
  setSelectedPinCode(value: string): void
  setSelectedDelivaryAddressData(data: DelivaryAddressData): void
  order(paymentMethod: string): Promise<void>
  placingOrder: boolean
  fetchingDeliveryCharge: boolean
  totalAmount?: number
}

const PaymentOptionCard = styled("div")<{ selected: boolean }>(({ theme, selected }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing(0.5),
  padding: theme.spacing(2),
  borderRadius: 12,
  border: `1.5px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: selected ? `${theme.palette.primary.main}0d` : theme.palette.background.paper,
  cursor: "pointer",
  transition: "border-color 0.2s, background-color 0.2s",
  "&:hover": {
    borderColor: theme.palette.primary.main
  }
}))

export default function CheckoutForm({
  deliveryAddresses,
  getAddresses,
  setSelectedPinCode,
  order,
  setSelectedDelivaryAddressData,
  placingOrder,
  fetchingDeliveryCharge,
  totalAmount
}: Props) {
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod" | "">("")
  const [paymentError, setPaymentError] = useState(false)

  const initialValues: FormValues = {
    card: "",
    date: "",
    time: "",
    address: "",
    voucher: "",
    cardNo: "",
    cardCVC: "",
    cardExpiry: "",
    cardHolderName: "",
    saveCard: false
  }

  const methods = useForm<FormValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema) as Resolver<FormValues>
  })

  const { handleSubmit, formState: { isSubmitting } } = methods

  const handleSubmitForm = handleSubmit((values) => {
    alert(JSON.stringify(values, null, 2))
  })

  const handleChangeTo = (method: "online" | "cod") => {
    setPaymentMethod(method)
    setPaymentError(false)
  }

  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      setPaymentError(true)
      return
    }
    order(paymentMethod)
  }

  const isLoading = isSubmitting || placingOrder || fetchingDeliveryCharge

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <DeliveryAddresses
        deliveryAddresses={deliveryAddresses}
        getAddresses={getAddresses}
        setSelectedDelivaryAddressData={setSelectedDelivaryAddressData}
        setSelectedPinCode={setSelectedPinCode}
      />

      <Card>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
          Payment Method
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <PaymentOptionCard selected={paymentMethod === "online"} onClick={() => handleChangeTo("online")}>
            <CreditCardIcon sx={{ fontSize: 28, color: paymentMethod === "online" ? "primary.main" : "text.secondary" }} />
            <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>Pay Online</Typography>
            <Typography variant="caption" color="text.secondary">UPI · Cards · Wallets</Typography>
          </PaymentOptionCard>

          <PaymentOptionCard selected={paymentMethod === "cod"} onClick={() => handleChangeTo("cod")}>
            <CurrencyRupeeIcon sx={{ fontSize: 28, color: paymentMethod === "cod" ? "primary.main" : "text.secondary" }} />
            <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>Cash on Delivery</Typography>
            <Typography variant="caption" color="text.secondary">Pay on arrival</Typography>
          </PaymentOptionCard>
        </Box>

        {paymentError && (
          <Typography color="error" variant="caption" sx={{ mb: 2, display: "block" }}>
            Please select a payment method
          </Typography>
        )}

        <Button
          size="large"
          fullWidth
          variant="contained"
          color="primary"
          loading={isLoading}
          onClick={handlePlaceOrder}
          endIcon={<ArrowForwardIcon />}
          sx={{
            borderRadius: 2,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 700,
            mt: 1
          }}
        >
          {totalAmount ? `Place Order · ₹${totalAmount.toFixed(2)}` : "Place Order"}
        </Button>
      </Card>
    </FormProvider>
  )
}
