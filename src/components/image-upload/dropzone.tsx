"use client"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import type { ChangeEvent } from "react"

interface Props {
  label: string
  disabled?: boolean
  loading?: boolean
  loadingLabel?: string
  accept?: string
  multiple?: boolean
  onFilesSelected: (files: File[]) => void
}

export default function ImageUploadDropzone({
  label,
  disabled,
  loading,
  loadingLabel = "Uploading files...",
  accept = "image/*",
  multiple = true,
  onFilesSelected
}: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ""
    if (files.length) onFilesSelected(files)
  }

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <CircularProgress size={22} />
        <Typography variant="body2" color="text.secondary">
          {loadingLabel}
        </Typography>
      </Box>
    )
  }

  return (
    <Button
      variant="outlined"
      component="label"
      startIcon={<CloudUploadIcon />}
      disabled={disabled}
      sx={{
        textTransform: "none",
        borderStyle: "dashed",
        borderColor: "grey.400",
        color: "grey.700"
      }}
    >
      {label}
      <input type="file" hidden multiple={multiple} accept={accept} onChange={handleChange} />
    </Button>
  )
}
