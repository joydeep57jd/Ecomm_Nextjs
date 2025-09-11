import { SingleProductResponse } from "@/models/SingleProduct.model"
import Typography from "@mui/material/Typography"

interface Props {
  product: SingleProductResponse;
}

export default function ProductDescription({ product }: Props) {
  return (
    <div>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Specification:
      </Typography>

      <div dangerouslySetInnerHTML={{ __html: product.variantDetails.itemDesc }}>
        {/* Brand: Beats <br />
        Model: S450 <br />
        Wireless Bluetooth Headset <br />
        FM Frequency Response: 87.5 – 108 MHz <br />
        Feature: FM Radio, Card Supported (Micro SD / TF) <br />
        Made in China <br /> */}
      </div>
    </div>
  )
}
