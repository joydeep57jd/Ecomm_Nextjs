"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Chip from "@mui/material/Chip"
import Typography from "@mui/material/Typography"
import { VariantOption } from "@/models/SingleProduct.model"
// DUMMY DATA

interface Props {
  variantMap: Map<string, VariantOption[]>
}

export default function ProductVariantSelector({ variantMap }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return Array.from(variantMap.entries()).map(([variantLabel, variants], index) => (
    <div className="mb-1" key={variantLabel}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {variantLabel}
      </Typography>

      <div className="variant-group">
        {variants.map((variant) => {
          const optionSearchParams = new URLSearchParams(searchParams)
          optionSearchParams.set(variant.optionName, variant.optionValue)
          const currentVaraintId = searchParams.get("variant")
          if (currentVaraintId) {
            const newVarintId = currentVaraintId?.split(",").map((variantId, variantIndex) => variantIndex === index ? variant.variantOptionValueId : variantId).join() ?? ""
            optionSearchParams.set("variant", newVarintId)
          } else {
            const newVarintId = Array.from(variantMap.entries()).map(([, variants], variantIndex) => variantIndex === index ? variant.variantOptionValueId : variants[0].variantOptionValueId).join()
            optionSearchParams.set("variant", newVarintId)
          }

          const optionUrl = () => {
            router.push(`${pathname}?${optionSearchParams}`, { scroll: false })
          }

          // The variant is active if it's in the url params.
          const defaultVariant = variants[0].optionValue
          const selectedVariant = searchParams.get(variant.optionName)
          const isActive = (selectedVariant || defaultVariant) === variant.optionValue

          return (
            <Chip
              key={variant.variantOptionValueId}
              label={(variant.optionValue)}
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
