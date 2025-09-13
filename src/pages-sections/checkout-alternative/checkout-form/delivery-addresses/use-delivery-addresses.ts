import { useState } from "react"
import { DelivaryAddressData } from "@/models/Address.model"

export default function useDeliveryAddresses() {
  const [addresses, setAddresses] = useState<DelivaryAddressData[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [editDeliveryAddress, setEditDeliveryAddress] = useState<DelivaryAddressData | undefined>()

  const toggleModal = () => setOpenModal((prev) => !prev)

  const handleAddNewAddress = () => {
    setEditDeliveryAddress(undefined)
    setOpenModal(true)
  }

  const handleEditDeliveryAddress = (address: DelivaryAddressData) => {
    setEditDeliveryAddress(address)
    setOpenModal(true)
  }

  const handleDeleteDeliveryAddress = (id: number) => {
    setAddresses((prev) => prev.filter((a) => a.customer.addrid !== id))
  }

  const handleSaveAddress = (newAddress: DelivaryAddressData) => {
    setAddresses((prev) => {
     
      const exists = prev.find((a) => a.customer.addrid === newAddress.customer.addrid)
      if (exists) {
        return prev.map((a) =>
          a.customer.addrid === newAddress.customer.addrid ? newAddress : a
        )
      }
      return [...prev, newAddress]
    })
  }

  return {
    addresses,
    openModal,
    editDeliveryAddress,
    toggleModal,
    handleAddNewAddress,
    handleEditDeliveryAddress,
    handleDeleteDeliveryAddress,
    handleSaveAddress,
  }
}
