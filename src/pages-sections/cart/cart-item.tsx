import Link from "next/link"
import Image from "next/image"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Add from "@mui/icons-material/Add"
import Remove from "@mui/icons-material/Remove"

import Trash from "icons/Trash"
import useCart from "hooks/useCart"
import { currency } from "lib"
import { ContentWrapper, ImageWrapper, QuantityButton, Wrapper } from "./styles"
import { Cart, } from "@/models/CartProductItem.models"
import { useUser } from "@/contexts/UserContenxt"


// =========================================================
type Props = { item: Cart, };
// =========================================================

export default function CartItem({ item }: Props) {

  const { dispatch } = useCart()
  const { user } = useUser()

  const handleCartAmountChange = (amount: number) => () => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: {
        ...item,
        qty: amount
      },
      isLoggedIn: !!user,
      isSyncRequired: !!user,
      user: user ?? undefined
    })
  }

  return (
    <Wrapper elevation={0} sx={{ opacity: item.isOutOfStock ? 0.72 : 1 }}>
      <ImageWrapper>
        <Image alt={item.productName} fill src={item.productImage} sizes="100px" />
        {item.isOutOfStock && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.38)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#fff", fontWeight: 700, fontSize: 10, textAlign: "center", lineHeight: 1.2, px: 0.5 }}
            >
              Out of<br />Stock
            </Typography>
          </Box>
        )}
      </ImageWrapper>

      <ContentWrapper>
        <Stack spacing={0.5} overflow="hidden">
          <Link href={`/products/${item.productId}?variantId=${item.itemVariantId}`}>
            <Typography noWrap variant="body1" fontSize={16}>
              {item.variantName}
            </Typography>
            <Typography noWrap variant="body2" fontSize={12}>
              {item.variantOptionDetails.map(variant => `${variant.optionName} - ${variant.optionValue}`).join(" / ")}
            </Typography>
          </Link>

          {item.isOutOfStock ? (
            <Chip label="Out of Stock" color="error" size="small" sx={{ width: "fit-content", height: 20, fontSize: 11 }} />
          ) : (
            <Typography noWrap variant="body1" fontWeight={600}>
              {currency(item.productPrice)}
              {item.productPrice !== item.mrp && (
                <Typography
                  component="span"
                  sx={{ fontWeight: 600, color: "text.secondary", textDecoration: "line-through", ml: 1 }}
                >
                  {currency(item.mrp)}
                </Typography>
              )}
            </Typography>
          )}
        </Stack>

        <div className="quantity-buttons-wrapper">
          <QuantityButton disabled={item.qty === 1 || !!item.isOutOfStock} onClick={handleCartAmountChange(item.qty - 1)}>
            <Remove fontSize="small" />
          </QuantityButton>

          <Typography variant="h6">{item.qty}</Typography>

          <QuantityButton disabled={item.qty >= item.stockQty! || !!item.isOutOfStock} onClick={handleCartAmountChange(item.qty + 1)}>
            <Add fontSize="small" />
          </QuantityButton>
        </div>

        <Typography noWrap variant="body1" fontSize={16} fontWeight={600} color={item.isOutOfStock ? "text.disabled" : "inherit"}>
          {item.isOutOfStock ? "—" : currency(item.productPrice * item.qty)}
        </Typography>

        <IconButton className="remove-item" size="small" onClick={handleCartAmountChange(0)}>
          <Trash fontSize="small" color="error" />
        </IconButton>
      </ContentWrapper>
    </Wrapper>
  )
}
