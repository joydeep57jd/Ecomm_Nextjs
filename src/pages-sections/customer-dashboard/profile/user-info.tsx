
// import { format } from "date-fns/format"
import Card from "@mui/material/Card"
import Typography from "@mui/material/Typography"
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box"
import  { UserProfile } from "@/models/User.model"
// CUSTOM DATA MODEL

// import {  UserData } from "@/models/Auth.model"

// ==============================================================
type Props = { user: UserProfile }
// ==============================================================

export default function UserInfo({ user }: Props) {
  return (
    
      <Card
        elevation={0}
        sx={{
          marginTop: 3,
          display: "flex",
          flexWrap: "wrap",
          border: "1px solid",
          borderColor: "grey.100",
          padding: "0.75rem 1.5rem",
          flexDirection: { md: "row", xs: "column" },
          alignItems: { md: "center", xs: "flex-start" },
          justifyContent: { md: "space-between", xs: "flex-start" }
        }}
      >
        <TableRowItem title="First Name" value={user?.custFName} />
        <TableRowItem title="Middle Name" value={user?.custMName} />
        <TableRowItem title="Last Name" value={user?.custLName} />
        <TableRowItem title="Email" value={user?.custEmail} />
        <TableRowItem title="Phone" value={user?.custPhone} />
        {/* <TableRowItem
          title="Birth date"
          value={format(new Date(user.dateOfBirth), "dd MMM, yyyy")}
        /> */}
      </Card>
    
  )
}

function TableRowItem({ title, value }: { title: string; value: string }) {
  return (
    <FlexBox flexDirection="column" p={1}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
        {title}
      </Typography>

      <span>{value}</span>
    </FlexBox>
  )
}
