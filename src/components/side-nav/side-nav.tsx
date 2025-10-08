import { useEffect, useState, ReactNode, useCallback } from "react"
import Drawer from "@mui/material/Drawer"
// GLOBAL CUSTOM COMPONENT
import OverlayScrollbar from "components/overlay-scrollbar"
import { Box, IconButton } from "@mui/material"
import Clear from "@mui/icons-material/Clear"
// ================================================================
interface Props {
  open?: boolean;
  width?: number | string;
  children: ReactNode;
  toggle?: () => void;
  position?: "left" | "right";
  handler: (event: () => void) => ReactNode;
  showCloseButton?: boolean;
}
// ================================================================

export default function SideNav({
  position = "left",
  open = false,
  width = 280,
  children,
  handler,
  toggle,
  showCloseButton
}: Props) {
  const [sideNavOpen, setSideNavOpen] = useState(open)

  useEffect(() => setSideNavOpen(open), [open])

  const handleToggleSideNav = useCallback(() => {
    setSideNavOpen((prev) => !prev)
  }, [])

  const handleClose = useCallback(() => {
    if (toggle) {
      toggle()
    } else {
      handleToggleSideNav()
    }
  }, [toggle, handleToggleSideNav])

  return (
    <div>
      <Drawer
        anchor={position}
        open={sideNavOpen}
        onClose={handleClose}
        sx={{ zIndex: 15001, ...(showCloseButton && { width: "80vw", maxWidth: 500 }) }}
        slotProps={{
          transition: {
            style: showCloseButton ? {} : {
              width
            }
          }
        }}
      >
        <OverlayScrollbar>
          <Box sx={showCloseButton ? { width: "80vw", maxWidth: 500, px: 5, py: 8 } : {}}>
            {
              showCloseButton && <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 30, top: 15, color: '#3741518a ' }}>
                <Clear fontSize="small" />
              </IconButton>
            }
            {children}
          </Box>
        </OverlayScrollbar>
      </Drawer>

      {handler(handleClose)}
    </div>
  )
}
