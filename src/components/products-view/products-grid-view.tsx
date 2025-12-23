'use client'
import Grid from "@mui/material/Grid"
// GLOBAL CUSTOM COMPONENTS
import ProductCard16 from "components/product-cards/product-card-16"
import { DataList } from "@/models/AllProduct.model"
import { VariantOptionDetails } from "@/models/Filters"

// ========================================================
type Props = { products: DataList[], variantOptions: VariantOptionDetails[], badges: string[] };
// ========================================================

type VariantMap = Record<string, VariantOptionDetails[]>

export default function ProductsGridView({ products, variantOptions, badges }: Props) {
  const variantMap = variantOptions?.reduce((acc: VariantMap, cur: VariantOptionDetails) => {
    const itemVariantId = cur.itemVariantId?.toString()
    if (!acc[itemVariantId]) {
      acc[itemVariantId] = [cur]
    } else {
      acc[itemVariantId].push(cur)
    }
    return acc
  }, {}) ?? {}

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid size={{ lg: 4, sm: 6, xs: 6, md:4}} key={product.id}>
          <ProductCard16 product={product} variantOptions={variantMap[product.itemVariantId ?? ''] ?? []} badges={badges} />
        </Grid>
      ))}
    </Grid>
  )
}
