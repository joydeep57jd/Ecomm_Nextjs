"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Chip from "@mui/material/Chip"
import Typography from "@mui/material/Typography"
import { SingleProductResponse, VariantOption } from "@/models/SingleProduct.model"
import { useEffect } from "react"
// DUMMY DATA

interface Props {
  variantMap: Map<string, VariantOption[]>
  product: SingleProductResponse
  selectedVariant: string
}

export default function ProductVariantSelector({ variantMap, product, selectedVariant }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (product?.variantOptionList) {
      const varint = product.variantOptionList
        .filter((v) => v.appliedOnVariant) 
        .map((v) => v.variantOptionValueId) 
        .join()
     
      if (selectedVariant === varint) return
      const optionSearchParams = new URLSearchParams(searchParams)
      optionSearchParams.set("variant", varint)
      router.replace(`${pathname}?${optionSearchParams}`, { scroll: false })
    }
  }, [product])

  return Array.from(variantMap?.entries())?.map(([variantLabel, variants], index) => (
    <div className="mb-1" key={variantLabel}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {variantLabel}
      </Typography>

      <div className="variant-group">
        {variants.map((variant) => {
          const optionSearchParams = new URLSearchParams(searchParams)
          const currentVaraintId = searchParams.get("variant")
          if (currentVaraintId) {
            const newVarintId =
              currentVaraintId
                ?.split(",")
                .map((variantId, variantIndex) =>
                  variantIndex === index ? variant.variantOptionValueId : variantId
                )
                .join() ?? ""
            optionSearchParams.set("variant", newVarintId)
          } else {
            const newVarintId = Array.from(variantMap.entries())
              .map(([, variants], variantIndex) =>
                variantIndex === index
                  ? variant.variantOptionValueId
                  : variants[0].variantOptionValueId
              )
              .join()
            optionSearchParams.set("variant", newVarintId)
          }
          optionSearchParams.delete("variantId")

          const optionUrl = () => {
            router.push(`${pathname}?${optionSearchParams}`, { scroll: false })
          }

          // The variant is active if it's in the url params.

          const isActive =
            product?.variantOptionList?.find((v) => v.optionName === variantLabel)?.optionValue ===
            variant.optionValue

          return (
            <Chip
              key={variant.variantOptionValueId}
              label={variant.optionValue}
              size="small"
              color="primary"
              onClick={optionUrl}
              variant={isActive ? "filled" : "outlined"}
            />
          )
        })}
      </div>
    </div>
  ))
}
