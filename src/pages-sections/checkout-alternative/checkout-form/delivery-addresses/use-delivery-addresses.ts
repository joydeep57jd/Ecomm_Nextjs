import { useState } from "react"
import { DelivaryAddressData } from "@/models/Address.model"

export default function useDeliveryAddresses() {
  const [addresses, setAddresses] = useState<DelivaryAddressData[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deleteAddressId, setDeleteAddressId] = useState(0)
  const [editDeliveryAddress, setEditDeliveryAddress] = useState<DelivaryAddressData | undefined>()
  const [isReloadRequired, setIsReloadRequired] = useState(false)

  const toggleModal = (isReloadRequired?: boolean) => {
    setOpenModal((prev) => !prev)
    setIsReloadRequired(!!isReloadRequired)
  }

  const handleAddNewAddress = () => {
    setEditDeliveryAddress(undefined)
    setOpenModal(true)
  }

  const handleEditDeliveryAddress = (address: DelivaryAddressData) => {
    setEditDeliveryAddress(address)
    setOpenModal(true)
  }

  const handleDeleteDeliveryAddress = (id: number) => {
    setOpenDeleteModal(true)
    setDeleteAddressId(id)
  }

  const toggleDeleteModal = (isReloadRequired?: boolean) => {
    setOpenDeleteModal((prev) => !prev)
    setIsReloadRequired(!!isReloadRequired)
  }

  return {
    addresses,
    setAddresses,
    openModal,
    editDeliveryAddress,
    toggleModal,
    handleAddNewAddress,
    handleEditDeliveryAddress,
    handleDeleteDeliveryAddress,
    isReloadRequired,
    setIsReloadRequired,
    toggleDeleteModal,
    openDeleteModal,
    deleteAddressId
  }
}
