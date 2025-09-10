import Grid from "@mui/material/Grid"
// GLOBAL CUSTOM COMPONENTS
import ProductCard16 from "components/product-cards/product-card-16"
import { DataList } from "@/models/AllProduct.model"

// ========================================================
type Props = { products: DataList[] };
// ========================================================

export default function ProductsGridView({ products }: Props) {
  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid size={{ lg: 4, sm: 6, xs: 12 }} key={product.id}>
          <ProductCard16 product={product} />
        </Grid>
      ))}
    </Grid>
  )
}
