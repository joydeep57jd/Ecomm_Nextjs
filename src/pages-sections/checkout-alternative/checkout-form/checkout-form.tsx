"use client"
import { Resolver, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Button from "@mui/material/Button"

import { Fragment, useState } from "react"
// GLOBAL CUSTOM COMPONENTS
import { FormProvider } from "components/form-hook"
// LOCAL CUSTOM COMPONENTS
import Card from "./card"
import Heading from "./heading"
// import DeliveryDate from "./delivery-date"
import Voucher from "./payments/voucher"
import FormLabel from "@/pages-sections/payment/form-label"
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

type FormValues = yup.InferType<typeof validationSchema>;

interface Props {
  deliveryAddresses: Address[];
  getAddresses(): Promise<void>
  setSelectedPinCode(value: string): void
  setSelectedDelivaryAddressData(data: DelivaryAddressData): void
  order(): Promise<void>
  placingOrder: boolean
}

export default function CheckoutForm({ deliveryAddresses, getAddresses, setSelectedPinCode, order, setSelectedDelivaryAddressData, placingOrder }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "paypal" | "cod">("cod")

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

  const {
    // watch,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  const handleSubmitForm = handleSubmit((values) => {
    alert(JSON.stringify(values, null, 2))
    // router.push("/payment");
  })

  const handleChangeTo = (method: "credit-card" | "paypal" | "cod") => {
    setPaymentMethod(method)
    if (method === "credit-card" || method === "paypal") {
      alert("Online payment mode is coming soon")
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      {/* <DeliveryDate deliveryTimes={deliveryTimes} /> */}

      <DeliveryAddresses deliveryAddresses={deliveryAddresses} getAddresses={getAddresses} setSelectedDelivaryAddressData={setSelectedDelivaryAddressData} setSelectedPinCode={setSelectedPinCode} />

      <Card>
        <Heading number={2} title="Payment Details" />
        <Fragment>
          <Card>
            {/* CREDIT CARD OPTION */}
            {/* <FormLabel
              name="credit-card"
              title="Pay with credit card"
              checked={paymentMethod === "credit-card"}
              handleChange={() => handleChangeTo("credit-card")}
            />

            <Divider sx={{ my: 3, mx: -4 }} /> */}

            {/* PAYPAL CARD OPTION */}
            {/* <FormLabel
              name="paypal"
              title="Pay with Paypal"
              checked={paymentMethod === "paypal"}
              handleChange={() => handleChangeTo("paypal")}
            />

            <Divider sx={{ my: 3, mx: -4 }} /> */}

            {/* CASH ON DELIVERY OPTION */}
            <FormLabel
              name="cod"
              title="Cash On Delivery"
              checked={paymentMethod === "cod"}
              handleChange={() => handleChangeTo("cod")}
            />
          </Card>


        </Fragment>

        <Voucher />

        <Button
          size="large"
          type="submit"
          color="primary"
          variant="contained"
          loading={isSubmitting || placingOrder}
          onClick={order}
        >
          Place Order
        </Button>
      </Card>
    </FormProvider>
  )
}
