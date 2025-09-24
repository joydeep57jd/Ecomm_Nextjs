import CircularProgress from "@mui/material/CircularProgress"
import FlexRowCenter from "components/flex-box/flex-row-center"

type Props = {
  isSmallLoader?: boolean
  isTiny?: boolean
}

export default function Loading({ isSmallLoader, isTiny }: Props) {

  return (
    <FlexRowCenter sx={{
      height: (isSmallLoader || isTiny) ? (isSmallLoader ? 'calc(100vh - 523px)' : '60px') : 'h-screen'
    }}>
      <CircularProgress color="primary" />
    </FlexRowCenter>
  )
}
