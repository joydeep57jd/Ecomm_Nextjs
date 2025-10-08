"use client"

import Link from "next/link"
import SvgIcon from "@mui/material/SvgIcon"
import IconButton from "@mui/material/IconButton"
import { useUser } from "@/contexts/UserContenxt"
import { Button } from "@mui/material"
export function HeaderLogin() {
  const { user } = useUser()

  return user ? (
    <>
      <Button
        variant="outlined"
        color="primary"
        sx={{
          textTransform: "uppercase",
          height: "32px",
          width: "32px",
          borderRadius: "100%",
          borderColor: "#3741518a",
          justifyContent: "center",
          display: { xs: "flex", sm: "none" }
        }}
      >
        <Link href={"/profile"}>
          {user.firstName[0]}
          {user.lastName[0]}
        </Link>
      </Button>
      <Button
        variant="text"
        color="primary"
        sx={{
          textTransform: "capitalize",
          border: "1px solid transparent",
          "&:hover": {
            border: "1px solid #3741518a"
          },
          display: { xs: "none", sm: "block" }
        }}
      >
        <Link href={"/profile"}>Hi, {user.firstName}</Link>
      </Button>
    </>
  ) : (
    <IconButton LinkComponent={Link} href={user ? "/profile" : "/login"}>
      <SvgIcon fontSize="small">
        <svg viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="9" r="3" />
            <circle cx="12" cy="12" r="10" />
            <path
              strokeLinecap="round"
              d="M17.97 20c-.16-2.892-1.045-5-5.97-5s-5.81 2.108-5.97 5"
            />
          </g>
        </svg>
      </SvgIcon>
    </IconButton>
  )
}
