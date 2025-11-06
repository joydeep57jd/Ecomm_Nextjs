"use client"
import { Item } from "@/models/OrderHistory.modal"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
  CircularProgress
} from "@mui/material"

type Props = {
  handleCloseModal: (isReloadRequired: boolean) => void
  item: Item
  onConfirm: () => void
  loading: boolean
}

const CancelItem = ({ handleCloseModal, item, onConfirm, loading }: Props) => {
  return (
    <Dialog open onClose={() => handleCloseModal(false)} fullWidth>
      <DialogTitle>
        <Typography variant="h5">Cancel Item</Typography>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to cancel:
        </Typography>

        <Typography fontWeight={600}>{item?.name}</Typography>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button onClick={() => handleCloseModal(false)} color="primary" variant="outlined">
          Close
        </Button>

        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={16} color="inherit" /> : "Confirm Cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CancelItem
