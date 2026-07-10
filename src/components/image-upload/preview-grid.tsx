"use client"

import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import DeleteIcon from "@mui/icons-material/Delete"
import Image from "next/image"

export interface PreviewItem {
  name: string
  src: string
  isImage: boolean
}

interface Props {
  items: PreviewItem[]
  onRemove: (index: number) => void
}

export default function ImageUploadPreviewGrid({ items, onRemove }: Props) {
  if (!items.length) return null

  return (
    <Box mt={2} display="grid" gridTemplateColumns="repeat(auto-fill, 80px)" gap={1.5}>
      {items.map((item, i) => (
        <Box
          key={i}
          sx={{
            position: "relative",
            borderRadius: 1,
            overflow: "hidden",
            border: "1px solid #ccc"
          }}
        >
          {item.isImage ? (
            <Image
              src={item.src}
              alt={item.name}
              width={80}
              height={80}
              style={{ objectFit: "cover", width: 80, height: 80 }}
            />
          ) : (
            <Box
              sx={{
                height: 80,
                width: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "grey.100",
                fontSize: 12
              }}
            >
              PDF
            </Box>
          )}

          <Typography
            variant="caption"
            noWrap
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "white",
              textAlign: "center",
              fontSize: "0.65rem",
              py: 0.3
            }}
          >
            {item.name}
          </Typography>

          <IconButton
            size="small"
            onClick={() => onRemove(i)}
            sx={{
              position: "absolute",
              top: 2,
              right: 2,
              backgroundColor: "rgba(255,255,255,0.7)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" }
            }}
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      ))}
    </Box>
  )
}
