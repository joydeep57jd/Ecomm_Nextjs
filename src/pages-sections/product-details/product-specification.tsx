import { VariantOption } from '@/models/SingleProduct.model'
import { Typography } from '@mui/material'
import React from 'react'

interface Props {
  specifications:  VariantOption[]
}

const ProductSpecification = ({specifications}:Props) => {
  return (
    <div>
      {specifications?.map((spec, index) => (
        <div key={index}>
          <Typography variant="body1">
            <strong>{spec.optionName}</strong>: {spec.optionValue}
          </Typography>
        </div>
      ))}
    </div>
  )
}

export default ProductSpecification