import { useEffect, useState, ReactNode, useCallback } from "react"
import Drawer from "@mui/material/Drawer"
// GLOBAL CUSTOM COMPONENT
import OverlayScrollbar from "components/overlay-scrollbar"
import Cross from "@/icons/Cross"
import { Box } from "@mui/material"

// ================================================================
interface Props {
  open?: boolean;
  width?: number;
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
        sx={{ zIndex: 15001 }}
        slotProps={{
          transition: {
            style: {
              width
            }
          }
        }}
      >
        <OverlayScrollbar>
          {
            showCloseButton &&
            <Box sx={{ position: 'relative', height: 40 }}>
              <Cross onClick={handleClose} sx={{ position: 'absolute', top: 12, right: 12 }} />
            </Box>
          }
          {children}
        </OverlayScrollbar>
      </Drawer>

      {handler(handleClose)}
    </div>
  )
}
