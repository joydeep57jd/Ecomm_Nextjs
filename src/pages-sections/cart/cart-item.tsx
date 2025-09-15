"use client"
import Link from "next/link"
import Image from "next/image"
import Stack from "@mui/material/Stack"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Add from "@mui/icons-material/Add"
import Remove from "@mui/icons-material/Remove"

import Trash from "icons/Trash"
import useCart from "hooks/useCart"
import { currency } from "lib"
import { ContentWrapper, ImageWrapper, QuantityButton, Wrapper } from "./styles"
import { RemoteCart } from "@/models/CartProductItem.models"
import { useUser } from "@/contexts/UserContenxt"
import { getLocalCartFromRemoteCart } from "@/utils/api/cart"

// =========================================================
type Props = { item: RemoteCart, getCartItems(): Promise<void> };
// =========================================================

export default function CartItem({ item }: Props) {

  const { dispatch } = useCart()
  const { user } = useUser()

  const handleCartAmountChange = (amount: number) => () => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: {
        ...getLocalCartFromRemoteCart([item])[0],
        qty: amount
      },
      isLoggedIn: true,
      isSyncRequired: true,
      user: user!
    })
  }

  return (
    <Wrapper elevation={0}>
      <ImageWrapper>
        <Image alt={item.name} fill src={item.images[0].fullImagepath} sizes="100px" />
      </ImageWrapper>

      <ContentWrapper>
        <Stack spacing={0.5} overflow="hidden">
          <Link href={`/products/${item.id}`}>
            <Typography noWrap variant="body1" fontSize={16}>
              {item.name}
            </Typography>
            <Typography noWrap variant="body2" fontSize={12}>
              {item.variantName?.split("/").slice(1).join("/")}
            </Typography>
          </Link>

          <Typography noWrap variant="body1" fontWeight={600}>
            {currency(item.price_regular)}
            {item.price_regular !== item.mrp && (
              <Typography
                component="span"
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textDecoration: "line-through",
                  ml: 1
                }}
              >
                {currency(item.mrp)}
              </Typography>
            )}

          </Typography>
        </Stack>

        <div className="quantity-buttons-wrapper">
          <QuantityButton disabled={item.quantity === 1} onClick={handleCartAmountChange(item.quantity - 1)}>
            <Remove fontSize="small" />
          </QuantityButton>

          <Typography variant="h6">{item.quantity}</Typography>

          <QuantityButton disabled={item.quantity >= item.stockQty!} onClick={handleCartAmountChange(item.quantity + 1)}>
            <Add fontSize="small" />
          </QuantityButton>
        </div>

        <Typography noWrap variant="body1" fontSize={16} fontWeight={600}>
          {currency(item.price_regular * item.quantity)}
        </Typography>

        <IconButton className="remove-item" size="small" onClick={handleCartAmountChange(0)}>
          <Trash fontSize="small" color="error" />
        </IconButton>
      </ContentWrapper>
    </Wrapper>
  )
}
