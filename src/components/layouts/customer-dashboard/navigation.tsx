"use client"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
// CUSTOM COMPONENTS
import NavItem from "./nav-item"
// STYLED COMPONENTS
import { MainContainer } from "./styles"
import { removeItem } from "@/utils/services/local-storage.service"
import { useUser } from "@/contexts/UserContenxt"
import { useRouter } from "next/navigation"

const MENUS = [
  {
    title: "DASHBOARD",
    list: [
      { icon: "Packages", href: "/orders", title: "Orders" },
      { icon: "HeartLine", href: "/wish-list", title: "Wishlist" },
    ]
  },
  {
    title: "ACCOUNT SETTINGS",
    list: [
      { icon: "User3", href: "/profile", title: "Profile Info" },
      { icon: "Location", href: "/address", title: "Address" },
      { icon: "Password", href: "/change-password", title: "Change Password" }
    ]
  }
]

export function Navigation() {

  const userState = useUser()
  const router = useRouter()

  const logout = () => {
    removeItem("guest_cart")
    removeItem("userDetails")
    userState.logout()
    router.push("/")
  }
  return (
    <MainContainer>
      {MENUS.map((item) => (
        <Box mt={2} key={item.title}>
          <Typography
            fontSize={12}
            variant="body1"
            fontWeight={500}
            color="text.secondary"
            textTransform="uppercase"
            sx={{ padding: ".75rem 1.75rem" }}
          >
            {item.title}
          </Typography>

          {item.list.map((listItem) => (
            <NavItem item={listItem} key={listItem.title} />
          ))}
        </Box>
      ))}

      <Box px={4} mt={6} pb={2}>
        <Button onClick={logout} disableElevation variant="outlined" color="primary" fullWidth>
          Logout
        </Button>
      </Box>
    </MainContainer>
  )
}
