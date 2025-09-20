"use client"
// MUI
import MuiPagination from "@mui/material/Pagination"
import { styled } from "@mui/material/styles"

// STYLED COMPONENT
export const StyledPagination = styled(MuiPagination)({
  display: "flex",
  marginTop: "2.5rem",
  justifyContent: "center"
})

// ==============================================================
type Props = {
  count: number;
  setCurrentPage(page: number): void
};
// ==============================================================

export default function Pagination({ count, setCurrentPage }: Props) {
  if (count <= 1) return null

  return <StyledPagination color="primary" count={count} onChange={(e, page) => setCurrentPage(page)} />
}
