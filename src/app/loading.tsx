import CircularProgress from "@mui/material/CircularProgress"
import FlexRowCenter from "components/flex-box/flex-row-center"

type Props = {
  isSmallLoader?: boolean
}

export default function Loading({ isSmallLoader }: Props) {
  return (
    <FlexRowCenter minHeight={isSmallLoader ? "" : "100vh"}>
      <CircularProgress color="primary" />
    </FlexRowCenter>
  )
}
