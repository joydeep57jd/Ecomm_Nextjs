"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
// MUI
import IconButton from "@mui/material/IconButton"
// MUI ICON COMPONENT
import Search from "@mui/icons-material/Search"
import { SearchInput2 } from "@/components/search-box"
// GLOBAL CUSTOM COMPONENTS

export function HeaderSearch() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentUrl = useRef(`${pathname}?${searchParams}`)
  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)

  useEffect(() => {
    const newUrl = `${pathname}?${searchParams}`

    if (currentUrl.current !== newUrl) {
      handleClose()
      currentUrl.current = newUrl
    }
  }, [pathname, searchParams])

  return (
    <Fragment>
      <IconButton onClick={() => setOpen(true)}>
        <Search />
      </IconButton>

      {
        open && <div style={{
          position: 'relative',
          top:"20px"
        }}>

          <SearchInput2 setOpen={setOpen} />
        </div>
      }
    </Fragment>
  )
}
