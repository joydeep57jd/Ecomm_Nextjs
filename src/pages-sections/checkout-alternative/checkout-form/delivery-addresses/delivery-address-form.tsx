"use client"
import { useMemo, useState } from "react"
import { Resolver, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import Typography from "@mui/material/Typography"
import DialogContent from "@mui/material/DialogContent"

import { FormProvider, TextField } from "components/form-hook"


import { validationSchema } from "@/schema/profile/address.schema"
import { DelivaryAddressData } from "@/models/Address.model"
import { SaveAddress } from "@/utils/api/profile"
import { useUser } from "@/contexts/UserContenxt"



type FormValues = yup.InferType<typeof validationSchema>;

// ==================================================================
interface Props {
  handleCloseModal: (isReloadRequired: boolean) => void;
  deliveryAddress?: DelivaryAddressData;
  onSave?: (address: DelivaryAddressData) => void;
}

// ==================================================================

export default function DeliveryAddressForm({ deliveryAddress, handleCloseModal }: Props) {
  const { user } = useUser()
  const [isSaving, setIsSaving] = useState(false)
  const initialValues: FormValues = useMemo(
    () => ({
      fname: deliveryAddress?.customer?.fname || "",
      lname: deliveryAddress?.customer?.lname || "",
      mname: deliveryAddress?.customer?.mname || "",
      phone: deliveryAddress?.customer?.phone || "",
      email: deliveryAddress?.customer?.email || "",
      address1: deliveryAddress?.customer?.address1 || "",
      address2: deliveryAddress?.customer?.address2 || "",
      pin: deliveryAddress?.customer?.pin || "",
      city: deliveryAddress?.customer?.city || "",
      dist: deliveryAddress?.customer?.dist || "",
      state: deliveryAddress?.customer?.state || "",
      country: deliveryAddress?.customer?.country || "",
    }),
    [deliveryAddress]
  )
  const methods = useForm<FormValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema) as Resolver<FormValues>
  })

  const { reset, handleSubmit } = methods

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    handleSubmit(async (values) => {
      setIsSaving(true)
      const payload: DelivaryAddressData = {
        CustomerId: Number(user?.customerId),
        customer: {
          userid: user?.id || "",
          addrid: deliveryAddress?.customer.addrid ?? -1,
          type: "",
          spclrequest: null,
          paymentmode: null,
          deliveryslot: null,
          UserPhoneCountryCode: "IN",
          PhoneCode: "+91",
          ...values
        }
      }

      await SaveAddress(payload)
      setIsSaving(false)
      reset()
      handleCloseModal(true)
    })(e)
  }


  return (
    <Dialog open onClose={handleCloseModal}>
      <DialogContent>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Add New Address Information
        </Typography>

        <FormProvider methods={methods} onSubmit={handleSubmitForm}>
          <Grid container spacing={3}>
            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField fullWidth name="fname" label="Enter Your First Name" />
            </Grid>
            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField fullWidth name="mname" label="Enter Your Middle Name" />
            </Grid>
            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField fullWidth name="lname" label="Enter Your Last Name" />
            </Grid>


            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField fullWidth name="address1" label="Address line 1" />
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField fullWidth name="address2" label="Address line 2" />
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField fullWidth name="phone" label="Enter Your Phone" />
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField fullWidth name="pin" label="Zip" />
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField fullWidth name="country" label="Country" />
            </Grid>

            <Grid size={{ sm: 6, xs: 12 }}>
              <Button color="primary" variant="contained" loading={isSaving} type="submit">
                Save
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
