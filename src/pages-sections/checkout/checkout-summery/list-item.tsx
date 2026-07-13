import Typography from "@mui/material/Typography"
// GLOBAL CUSTOM COMPONENTS
import FlexBetween from "components/flex-box/flex-between"
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib"

// ==============================================================
interface Props {
  title: string;
  value?: number;
  isDiscount?: boolean;
}
// ==============================================================

export default function ListItem({ title, value, isDiscount }: Props) {
  return (
    <FlexBetween mb={1}>
      <Typography variant="body1" color="text.secondary">
        {title}:
      </Typography>

      <Typography variant="h6" color={isDiscount && value ? "success.main" : "inherit"}>
        {value ? `${isDiscount ? "-" : ""}${currency(value)}` : "-"}
      </Typography>
    </FlexBetween>
  )
}
