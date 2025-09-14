import { deleteAddress } from '@/utils/api/profile'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material'
import React, { useState } from 'react'

interface Props {
    handleCloseModal: (isReloadRequired: boolean) => void;
    addressId: number;
}

const DeleteDeliveryAddress = ({ handleCloseModal, addressId }: Props) => {

    const [isDeleting, setIsDeleting] = useState(false)

    const deleteRecord = async () => {
        setIsDeleting(true)
        await deleteAddress(addressId)
        setIsDeleting(false)
        handleCloseModal(true)
    }

    return <Dialog open onClose={handleCloseModal} fullWidth>
        <DialogTitle id="alert-dialog-title">
            <Typography variant="h4">
                Delete Address
            </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
            <Typography variant="body2" sx={{ mb: 3 }}>
                Are you sure You want to delete this Address?
            </Typography>
        </DialogContent>
        <Divider />
        <DialogActions>
            <Button onClick={() => handleCloseModal(false)} color="primary" variant="outlined">
                Cancel
            </Button>
            <Button onClick={deleteRecord} loading={isDeleting} color="error" variant="contained">
                Delete
            </Button>
        </DialogActions>
    </Dialog>
}

export default DeleteDeliveryAddress