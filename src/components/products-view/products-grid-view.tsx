import Grid from "@mui/material/Grid"
// GLOBAL CUSTOM COMPONENTS
import ProductCard16 from "components/product-cards/product-card-16"
import { DataList } from "@/models/AllProduct.model"
import { VariantOptionDetails } from "@/models/Filters"

// ========================================================
type Props = { products: DataList[], variantOptions: VariantOptionDetails[] };
// ========================================================

type VariantMap = Record<string, VariantOptionDetails[]>

export default function ProductsGridView({ products, variantOptions }: Props) {
  const variantMap = variantOptions?.reduce((acc: VariantMap, cur: VariantOptionDetails) => {
    const itemVariantId = cur.itemVariantId?.toString()
    if (!itemVariantId) return acc
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
        <Grid size={{ lg: 4, sm: 6, xs: 12 }} key={product.id}>
          <ProductCard16 product={product} variantOptions={variantMap[product.itemVariantId ?? ''] ?? []} />
        </Grid>
      ))}
    </Grid>
  )
}
