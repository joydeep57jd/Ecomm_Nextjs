"use client"

import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
// MUI
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import CircularProgress from "@mui/material/CircularProgress"
import ClickAwayListener from "@mui/material/ClickAwayListener"
// CUSTOM ICON COMPONENT
import Search from "icons/Search"
// CUSTOM DATA MODEL
import { CategoryLink } from "models/Layout.model"
import { DataList } from "@/models/AllProduct.model"
// API + UTILS
import { getAllProducts } from "@/utils/api/product"
import { encodeId } from "@/utils/url-id"
// import { currency } from "lib"

const INPUT_PROPS = {
  sx: {
    border: 0,
    padding: 0,
    borderRadius: "799px",
    borderColor: "transparent",
    overflow: "hidden",
    backgroundColor: "grey.50",
    "& .MuiOutlinedInput-notchedOutline": {
      border: 1,
      borderRadius: "799px",
      borderColor: "transparent"
    }
  },
  endAdornment: (
    <Box
      ml={2}
      pl={2}
      pr={1}
      display="grid"
      alignItems="center"
      justifyContent="center"
      borderLeft="1px solid"
      borderColor="grey.200"
    >
      <Search sx={{ fontSize: 17, color: "grey.400" }} />
    </Box>
  )
}

// Rotating placeholder suggestions
const PLACEHOLDER_ITEMS = [
  "Masoor dal",
  "Basmati Rice",
  "Turmeric powder",
  "Bell Peppers",
  "Polo t-shirt",
  "Home Speaker"
]

const MIN_CHARS = 3
const DEBOUNCE_MS = 300

// ==============================================================
interface Props {
  categories: CategoryLink[];
}
// ==============================================================

export function SearchInput1({ }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  // Typeahead state
  const [results, setResults] = useState<DataList[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_ITEMS.length)
    }, 2500)

    return () => clearInterval(id)
  }, [])

  // Debounced typeahead search: fire 300ms after 3+ characters.
  useEffect(() => {
    const query = search.trim()

    if (query.length < MIN_CHARS) {
      setResults([])
      setSearched(false)
      setLoading(false)
      setOpen(false)
      return
    }

    setLoading(true)
    setOpen(true)

    const handler = setTimeout(async () => {
      try {
        const res = await getAllProducts({ searchCriteria: query, pageNo: 1, pageSize: 6 })
        setResults(res?.dataList ?? [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
        setSearched(true)
      }
    }, DEBOUNCE_MS)

    return () => clearTimeout(handler)
  }, [search])

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams)
    params.set("search", search)
    router.push(`/products/search?${params.toString()}`)
    setSearch("")
    setOpen(false)
  }, [search, router, searchParams])

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, [])

  const handleEnter = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleSearch()
    }
  }

  const handleSelect = (item: DataList) => {
    setOpen(false)
    setSearch("")
    router.push(`/products/${encodeId(item.itemId)}`)
  }

  const showDropdown = open && search.trim().length >= MIN_CHARS

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box position="relative">
        <TextField
          fullWidth
          value={search}
          variant="outlined"
          onKeyDown={handleEnter}
          onChange={handleChange}
          onFocus={() => {
            if (search.trim().length >= MIN_CHARS) setOpen(true)
          }}
          placeholder={`Search "${PLACEHOLDER_ITEMS[placeholderIndex]}"`}
          slotProps={{ input: INPUT_PROPS }}
          aria-label="Search products"
          role="searchbox"
        />

        {showDropdown && (
          <Paper
            elevation={6}
            sx={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              zIndex: 30,
              maxHeight: 360,
              overflowY: "auto",
              borderRadius: 2,
              py: 0.5
            }}
          >
            {loading ? (
              <Box display="flex" alignItems="center" gap={1} px={2} py={1.5}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Searching…
                </Typography>
              </Box>
            ) : results.length > 0 ? (
              results.map((item) => (
                <Box
                  key={item.itemId}
                  // onMouseDown (before blur) so the click registers before the input loses focus
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleSelect(item)
                  }}
                  sx={{
                    px: 2,
                    py: 1,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.5,
                    transition: "background-color 120ms ease-in-out",
                    ":hover": { backgroundColor: "grey.100" }
                  }}
                >
                  <Typography variant="body2" noWrap sx={{ minWidth: 0 }}>
                    {item.itemName}
                  </Typography>
                  {/* <Typography
                    variant="body2"
                    fontWeight={700}
                    color="orange.dark"
                    whiteSpace="nowrap"
                  >
                    {currency(item.discountedPrice ?? item.mrp, 0)}
                  </Typography> */}
                </Box>
              ))
            ) : searched ? (
              <Box px={2} py={1.5}>
                <Typography variant="body2" color="text.secondary">
                  No item found
                </Typography>
              </Box>
            ) : null}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  )
}
