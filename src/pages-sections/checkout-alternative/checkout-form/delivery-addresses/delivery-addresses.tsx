"use client"
import { Controller, useFormContext } from "react-hook-form"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Radio from "@mui/material/Radio"
import { styled } from "@mui/material/styles"
import Trash from "icons/Trash"
import Pencil from "icons/Pencil"
import useDeliveryAddresses from "./use-delivery-addresses"
import Card from "../card"
import { FlexBetween, FlexBox } from "components/flex-box"
import { Address } from "@/models/User.model"
import DeliveryAddressForm from "./delivery-address-form"
import { useEffect } from "react"
import { DelivaryAddressData } from "@/models/Address.model"
import { useUser } from "@/contexts/UserContenxt"
import DeleteDeliveryAddress from "./delete-delivery-address"
import DashboardHeader from "@/pages-sections/customer-dashboard/dashboard-header"
import Location from "@/icons/Location"
import AddIcon from "@mui/icons-material/Add"

const AddressCard = styled("div")<{ active: boolean; error: boolean }>(({ theme, active, error }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 2),
  borderRadius: 12,
  border: `1.5px solid ${error ? theme.palette.error.main : active ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: active ? `${theme.palette.primary.main}08` : theme.palette.background.paper,
  cursor: "pointer",
  marginBottom: theme.spacing(1.5),
  transition: "border-color 0.2s, background-color 0.2s",
  position: "relative"
}))

type Props = {
  deliveryAddresses: Address[]
  getAddresses(): Promise<void>
  setSelectedPinCode?(value: string): void
  setSelectedDelivaryAddressData?(data: DelivaryAddressData): void
}

export default function DeliveryAddresses({
  deliveryAddresses,
  getAddresses,
  setSelectedPinCode,
  setSelectedDelivaryAddressData
}: Props) {
  const {
    openModal,
    toggleModal,
    editDeliveryAddress,
    handleAddNewAddress,
    handleEditDeliveryAddress,
    handleDeleteDeliveryAddress,
    addresses,
    setAddresses,
    isReloadRequired,
    setIsReloadRequired,
    openDeleteModal,
    deleteAddressId,
    toggleDeleteModal
  } = useDeliveryAddresses()

  const { user } = useUser()

  useEffect(() => {
    if (deliveryAddresses) {
      const mapped = deliveryAddresses.map((a) => ({
        customer: { ...a, userid: user!.id },
        CustomerId: +user!.customerId
      }))

      setAddresses(mapped)
      setIsReloadRequired(false)

      if (mapped.length > 0) {
        const defaultAddress = mapped.find((a) => a.customer.isDefault === true) || mapped[0]

        setValue("address", defaultAddress.customer.addrid, {
          shouldValidate: true,
          shouldDirty: true
        })

        if (setSelectedPinCode) setSelectedPinCode(defaultAddress.customer.pin)
        if (setSelectedDelivaryAddressData) setSelectedDelivaryAddressData(defaultAddress)
      }
    }
  }, [deliveryAddresses])

  useEffect(() => {
    if (isReloadRequired) {
      getAddresses()
    }
  }, [isReloadRequired])

  const { control, setValue } = useFormContext()

  const isCheckout = !!(setSelectedPinCode && setSelectedDelivaryAddressData)

  const HeaderSection = isCheckout ? (
    <FlexBetween mb={2.5}>
      <Typography variant="h6" fontWeight={700}>Delivery Address</Typography>
      <Button
        size="small"
        color="primary"
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddNewAddress}
        sx={{ borderRadius: 2, textTransform: "none" }}
      >
        Add New
      </Button>
    </FlexBetween>
  ) : (
    <div>
      <DashboardHeader Icon={Location} title="Address" />
      <div style={{ display: "flex", justifyContent: "end", marginBottom: "1.5rem" }}>
        <Button color="primary" variant="outlined" onClick={handleAddNewAddress}>
          Add New Address
        </Button>
      </div>
    </div>
  )

  if (!Array.isArray(addresses) || addresses.length === 0) {
    return (
      <Card>
        {HeaderSection}
        <Typography fontSize={16} variant="body1" color="text.secondary" textAlign="center">
          No delivery addresses found. Please add a new address.
        </Typography>
        {openModal && (
          <DeliveryAddressForm
            handleCloseModal={toggleModal}
            deliveryAddress={editDeliveryAddress}
          />
        )}
      </Card>
    )
  }

  return (
    <Card>
      {HeaderSection}

      <Box>
        {addresses.map((address) => (
          <Controller
            key={address.customer.addrid}
            name="address"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <AddressCard
                error={Boolean(error)}
                active={address.customer.addrid === field.value}
                onClick={() => {
                  if (isCheckout) {
                    field.onChange(address.customer.addrid)
                    setSelectedPinCode!(address.customer.pin)
                    setSelectedDelivaryAddressData!(address)
                  }
                }}
              >
                <Radio
                  checked={address.customer.addrid === field.value}
                  color="primary"
                  size="small"
                  sx={{ mt: -0.5, p: 0.5, flexShrink: 0 }}
                />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={700}>
                    {address.customer.fname} {address.customer.lname}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {address.customer.phone}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {[address.customer.address1, address.customer.address2].filter(Boolean).join(", ")}
                  </Typography>
                  {address.customer.city && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {[address.customer.city, address.customer.state, address.customer.pin].filter(Boolean).join(", ")}
                    </Typography>
                  )}
                  {address.customer.email && (
                    <Typography variant="caption" color="text.disabled" display="block">
                      {address.customer.email} · {address.customer.country} – {address.customer.pin}
                    </Typography>
                  )}
                </Box>

                <FlexBox gap={0} sx={{ flexShrink: 0, mt: -0.5 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); handleEditDeliveryAddress(address) }}
                  >
                    <Pencil sx={{ fontSize: 15 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => { e.stopPropagation(); handleDeleteDeliveryAddress(address.customer.addrid) }}
                  >
                    <Trash sx={{ fontSize: 15 }} />
                  </IconButton>
                </FlexBox>
              </AddressCard>
            )}
          />
        ))}
      </Box>

      {openModal && (
        <DeliveryAddressForm handleCloseModal={toggleModal} deliveryAddress={editDeliveryAddress} />
      )}

      {openDeleteModal && (
        <DeleteDeliveryAddress addressId={deleteAddressId} handleCloseModal={toggleDeleteModal} />
      )}
    </Card>
  )
}
