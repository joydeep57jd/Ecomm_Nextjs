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
import { Cart,  } from "@/models/CartProductItem.models"
import { useUser } from "@/contexts/UserContenxt"


// =========================================================
type Props = { item: Cart,  };
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
      user: user??undefined
    })
  }

  return (
    <Wrapper elevation={0}>
      <ImageWrapper>
        <Image alt={item.productName} fill src={item.productImage} sizes="100px" />
      </ImageWrapper>

      <ContentWrapper>
        <Stack spacing={0.5} overflow="hidden">
          <Link href={`/products/${item.productId}?variantId=${item.itemVariantId}`}>
            <Typography noWrap variant="body1" fontSize={16}>
              {item.productName}
            </Typography>
            <Typography noWrap variant="body2" fontSize={12}>
              {item.variantName?.split("/").slice(1).join("/")}
            </Typography>
          </Link>

          <Typography noWrap variant="body1" fontWeight={600}>
            {currency(item.productPrice)}
            {item.productPrice !== item.mrp && (
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
          <QuantityButton disabled={item.qty === 1} onClick={handleCartAmountChange(item.qty - 1)}>
            <Remove fontSize="small" />
          </QuantityButton>

          <Typography variant="h6">{item.qty}</Typography>

          <QuantityButton disabled={item.qty >= item.stockQty!} onClick={handleCartAmountChange(item.qty + 1)}>
            <Add fontSize="small" />
          </QuantityButton>
        </div>

        <Typography noWrap variant="body1" fontSize={16} fontWeight={600}>
          {currency(item.productPrice * item.qty)}
        </Typography>

        <IconButton className="remove-item" size="small" onClick={handleCartAmountChange(0)}>
          <Trash fontSize="small" color="error" />
        </IconButton>
      </ContentWrapper>
    </Wrapper>
  )
}
