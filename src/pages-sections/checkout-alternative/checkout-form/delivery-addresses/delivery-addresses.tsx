"use client"
import { Controller, useFormContext } from "react-hook-form"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { styled, alpha } from "@mui/material/styles"
// CUSTOM ICON COMPONENTS
import Trash from "icons/Trash"
import Pencil from "icons/Pencil"
// LOCAL CUSTOM HOOK
import useDeliveryAddresses from "./use-delivery-addresses"
// LOCAL CUSTOM COMPONENTS
import Card from "../card"
import Heading from "../heading"
// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box"
// TYPES
import { Address } from "@/models/User.model"
import DeliveryAddressForm from "./delivery-address-form"
import { useEffect } from "react"
import { DelivaryAddressData } from "@/models/Address.model"
import { useUser } from "@/contexts/UserContenxt"
import DeleteDeliveryAddress from "./delete-delivery-address"
import DashboardHeader from "@/pages-sections/customer-dashboard/dashboard-header"
import Location from "@/icons/Location"

// STYLED COMPONENTS
const AddressCard = styled("div", {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "error"
})<{ active: boolean; error: boolean }>(({ theme, active, error }) => ({
  padding: "1rem",
  boxShadow: "none",
  cursor: "pointer",
  position: "relative",
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  ...(error && {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    backgroundColor: alpha(theme.palette.error.light, 0.3)
  }),
  ...(active && {
    borderColor: theme.palette.grey[100],
    backgroundColor: theme.palette.grey[100]
  }),
  h6: { marginBottom: theme.spacing(0.5) },
  p: { color: theme.palette.grey[700] },
  height: '-webkit-fill-available'
}))

type Props = { deliveryAddresses: Address[], getAddresses(): Promise<void>, setSelectedPinCode?(value: string): void, setSelectedDelivaryAddressData?(data: DelivaryAddressData): void };

export default function DeliveryAddresses({ deliveryAddresses, getAddresses, setSelectedPinCode, setSelectedDelivaryAddressData }: Props) {
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
      setAddresses(deliveryAddresses.map(a => ({
        customer: { ...a, userid: user!.id },
        CustomerId: +user!.customerId
      })))
      setIsReloadRequired(false)
    }
  }, [deliveryAddresses])

  useEffect(() => {
    if (isReloadRequired) {
      getAddresses()
    }
  }, [isReloadRequired])



  const { control } = useFormContext()


  const HeaderSection = (setSelectedPinCode && setSelectedDelivaryAddressData) ? <>
    <FlexBetween sx={{
      width: '100%'
    }} mb={4}>
      <Heading number={1} title="Delivery Address" mb={0} />
      <Button color="primary" variant="outlined" onClick={handleAddNewAddress}>
        Add New Address
      </Button>
    </FlexBetween>
  </>
    :
    <div>
      <DashboardHeader Icon={Location} title="Adderesses" />
      <div style={{
        display: 'flex', justifyContent: 'end', marginBottom: '1.5rem'
      }}>
        <Button color="primary" variant="outlined" onClick={handleAddNewAddress}>
          Add New Address
        </Button>

      </div>
    </div>

  if (!Array.isArray(addresses) || addresses.length === 0) {
    return (
      <Card>
        {HeaderSection}

        <Typography fontSize={16} variant="body1" color="text.secondary" textAlign="center">
          No delivery addresses found. Please add a new address.
        </Typography>
        {openModal && (
          <DeliveryAddressForm handleCloseModal={toggleModal} deliveryAddress={editDeliveryAddress} />
        )}
      </Card>
    )
  }

  return (
    <Card>
      {HeaderSection}

      <Grid container spacing={2}>
        {addresses.map((address) => (

          <Controller
            name="address"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Grid size={{ md: 4, sm: 6, xs: 12 }} sx={{ borderRadius: '12px', border: '1px solid #fff', ...(address.customer.addrid === field.value && { borderColor: 'primary.main' }) }} key={address.customer.addrid}>
                <AddressItem
                  address={address}
                  isSelected={address.customer.addrid === field.value}
                  hasError={Boolean(error)}
                  onSelect={(address) => {
                    if (setSelectedPinCode &&
                      setSelectedDelivaryAddressData) {
                      field.onChange(address.customer.addrid)
                      setSelectedPinCode && setSelectedPinCode(address.customer.pin)
                      setSelectedDelivaryAddressData && setSelectedDelivaryAddressData(address)
                    }
                  }}
                  onEdit={handleEditDeliveryAddress}
                  onDelete={handleDeleteDeliveryAddress}
                />
              </Grid>
            )}
          />
        ))}
      </Grid>

      {/* SHOW DELIVERY ADDRESS FORM MODAL WHEN CLICK EDIT BUTTON */}
      {openModal && (
        <DeliveryAddressForm handleCloseModal={toggleModal} deliveryAddress={editDeliveryAddress} />
      )}

      {openDeleteModal && (
        <DeleteDeliveryAddress addressId={deleteAddressId} handleCloseModal={toggleDeleteModal} />
      )}
    </Card>
  )
}

interface AddressItemProps {
  hasError: boolean;
  isSelected: boolean;
  address: DelivaryAddressData;
  onDelete: (id: number) => void;
  onSelect: (address: DelivaryAddressData) => void;
  onEdit: (address: DelivaryAddressData) => void;
}

function AddressItem({
  address,
  hasError,
  isSelected,
  onSelect,
  onEdit,
  onDelete
}: AddressItemProps) {
  return (
    <AddressCard error={hasError} active={isSelected} onClick={() => onSelect(address)}>
      <FlexBox position="absolute" top={13} right={7}>
        <IconButton size="small" onClick={() => onEdit(address)}>
          <Pencil color="inherit" sx={{ fontSize: 16 }} />
        </IconButton>

        <IconButton size="small" color="error" onClick={() => onDelete(address.customer.addrid)}>
          <Trash color="error" sx={{ fontSize: 16 }} />
        </IconButton>
      </FlexBox>

      <Typography noWrap variant="h6">
        {address.customer.fname} {address.customer.lname}
      </Typography>

      <Typography variant="body1">{address.customer.phone}</Typography>

      <Typography variant="body1">{address.customer.address1}</Typography>

      <Typography variant="body1">{address.customer.address2 || ""}</Typography>

      <Typography variant="body1">{address.customer.country} - {address.customer.pin}</Typography>

    </AddressCard>
  )
}
