"use client"

import Loading from "@/app/loading"
import { useUser } from "@/contexts/UserContenxt"
import { UserAddressListResponse } from "@/models/User.model"
import DeliveryAddresses from "@/pages-sections/checkout-alternative/checkout-form/delivery-addresses"
import { getAddressList } from "@/utils/api/profile"
import { useEffect, useState } from "react"
import { FormProvider } from "components/form-hook"
import { Resolver, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

export default function Address() {
  const [addressListResponse, setAddressListResponse] = useState<UserAddressListResponse | null>(null)
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      getAddresses()
    }
  }, [user])

  const getAddresses = async () => {
    const response = await getAddressList(+user?.customerId!)
    setAddressListResponse(response)
  }

  const methods = useForm<{}>({
    defaultValues: {},
    resolver: yupResolver(yup.object()) as Resolver<{}>
  })

  return <FormProvider methods={methods} onSubmit={() => { }}>
    {
      !addressListResponse ? <Loading isSmallLoader={true} /> : <DeliveryAddresses deliveryAddresses={addressListResponse!.data} getAddresses={getAddresses} />
    }
  </FormProvider>

}
