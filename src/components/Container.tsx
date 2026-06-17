import MuiContainer, { ContainerProps } from "@mui/material/Container"

export default function Container({ children, sx, ...props }: ContainerProps) {
  return (
    <MuiContainer sx={{ mb: { xs: 3, sm: 4 }, ...sx }} {...props}>
      {children}
    </MuiContainer>
  )
}
