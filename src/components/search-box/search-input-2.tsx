"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
// MUI
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
// STYLED COMPONENT
import Cross from "@/icons/Cross"

export function SearchInput2({ setOpen }: { setOpen(value: boolean): void }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState("")

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams)
    params.set("search", search)
    router.push(`/products/search?${params.toString()}`)
    setSearch("")
  }, [router, searchParams, search])

  const INPUT_PROPS = {
    sx: {
      border: 0,
      padding: 0,
      borderRadius: 1,
      borderColor: "transparent",
      overflow: "hidden",
      backgroundColor: "grey.50",
      "& .MuiOutlinedInput-notchedOutline": {
        border: 1,
        borderRadius: 1,
        borderColor: "transparent"
      }
    },
    endAdornment: (
      <Box
        ml={2}
        px={2}
        display="grid"
        alignItems="center"
        justifyContent="center"
        borderLeft="1px solid"
        borderColor="grey.200"
        onClick={() => setOpen(false)}
      >
        <Cross sx={{ fontSize: 17, color: "grey.400" }} />
      </Box>
    )
  }

  const handleKeyDown = (code: string) => {
    if (code === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Box sx={{
      left: 0,
      right: 0,
      position: 'fixed',
      maxWidth: 'unset',
      zIndex: 999,
      background: '#fff',
      padding: '.25rem  1rem'
    }} flex="1 1 0" maxWidth={670} mx="auto">
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Searching for..."
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e.code)}
        slotProps={{ input: INPUT_PROPS }}
        aria-label="Search products"
        role="searchbox"
      />
    </Box>
  )
}
