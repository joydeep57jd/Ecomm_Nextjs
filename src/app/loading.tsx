import CircularProgress from "@mui/material/CircularProgress"
import FlexRowCenter from "components/flex-box/flex-row-center"

type Props = {
  isSmallLoader?: boolean
}

export default function Loading({ isSmallLoader }: Props) {
  return (
    <FlexRowCenter height={420} className={isSmallLoader ? 'h-[calc(100vh-3rem)]' : 'h-screen'}>
      <CircularProgress color="primary" />
    </FlexRowCenter>
  )
}
