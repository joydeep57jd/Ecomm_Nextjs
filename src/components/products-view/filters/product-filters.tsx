"use client"

import { Fragment } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
// MUI
import Box from "@mui/material/Box"
import Rating from "@mui/material/Rating"
import Slider from "@mui/material/Slider"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Collapse from "@mui/material/Collapse"
import TextField from "@mui/material/TextField"
import FormGroup from "@mui/material/FormGroup"
import Typography from "@mui/material/Typography"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
// GLOBAL CUSTOM COMPONENTS
import AccordionHeader from "components/accordion"
import { FlexBetween, FlexBox } from "components/flex-box"
// LOCAL CUSTOM COMPONENTS
import CheckboxLabel from "./checkbox-label"
// TYPES
import Filters from "models/Filters"
import { GetCategoryResponse } from "@/models/Category.modal"

interface Props {
  filters: Filters
  categoryOptions: GetCategoryResponse[]
}

export default function ProductFilters({ filters, categoryOptions }: Props) {
  // const { brands: BRANDS, others: OTHERS, colors: COLORS } = filters

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleClearFilters = () => {
    router.push(pathname)
  }

  
  const handleChangeSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (key === "OptionValueIds") {
      const existing = params.getAll("OptionValueIds")
      if (existing.includes(value)) {
        const filtered = existing.filter((v) => v !== value)
        params.delete("OptionValueIds")
        filtered.forEach((v) => params.append("OptionValueIds", v))
      } else {
        params.append("OptionValueIds", value)
      }
    } else {
      params.set(key, value)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div>
      {/* CATEGORY OPTIONS */}
      <Typography variant="h6" sx={{ mb: 1.25 }}>
        Categories
      </Typography>

   {categoryOptions.map((cat, idx) => (
  <Fragment key={cat.variantOptionId}>
    <AccordionHeader
      open={false}
      onClick={() => {}}
      sx={{ padding: ".5rem 0", cursor: "pointer", color: "grey.700" }}
    >
      <Typography component="span" fontWeight={600}>
        {cat.optionName}
      </Typography>
    </AccordionHeader>

    <Collapse in={true}>
      {idx === 1 ? (
        // ✅ Second variant option (Box style)
        <FlexBox flexWrap="wrap" gap={1.5} sx={{ pl: 2, mb: 1 }}>
          {cat.optionValues.map((opt) => (
            <Box
              key={opt.optionValueId}
              onClick={() =>
                handleChangeSearchParams("OptionValueIds", opt.optionValueId.toString())
              }
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.400",
                cursor: "pointer",
                fontSize: 14,
                color: "grey.700",
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                },
              }}
            >
              {opt.optionValueName}
            </Box>
          ))}
        </FlexBox>
      ) : (
        // ✅ Default style (Checkboxes)
        <FormGroup sx={{ pl: 2, mb: 1 }}>
          {cat.optionValues.map((opt) => (
            <FormControlLabel
              key={opt.optionValueId}
              control={
                <Checkbox
                  size="small"
                  onChange={() =>
                    handleChangeSearchParams("OptionValueIds", opt.optionValueId.toString())
                  }
                />
              }
              label={opt.optionValueName}
              sx={{ fontSize: 14, color: "grey.600" }}
            />
          ))}
        </FormGroup>
      )}
    </Collapse>
  </Fragment>
))}


      <Box component={Divider} my={3} />

      {/* PRICE VARIANT FILTER */}
      {/* <Typography variant="h6" sx={{ mb: 2 }}>
        Price Range
      </Typography>

      <Slider
        min={0}
        max={300}
        size="small"
        value={[0, 300]}
        valueLabelDisplay="auto"
        valueLabelFormat={(v) => `$${v}`}
        onChange={(_, v) => handleChangeSearchParams("price", (v as number[]).join(","))}
      />

      <FlexBetween>
        <TextField fullWidth size="small" type="number" placeholder="0" />
        <Typography variant="h5" sx={{ px: 1, color: "grey.600" }}>
          -
        </Typography>
        <TextField fullWidth size="small" type="number" placeholder="250" />
      </FlexBetween> */}

      {/* <Box component={Divider} my={3} /> */}

      {/* BRAND VARIANT FILTER */}
      {/* <Typography variant="h6" sx={{ mb: 2 }}>
        Brands
      </Typography>

      <FormGroup>
        {BRANDS.map(({ label, value }) => (
          <CheckboxLabel
            key={value}
            label={label}
            checked={false}
            onChange={() => handleChangeSearchParams("brand", value)}
          />
        ))}
      </FormGroup>

      <Box component={Divider} my={3} /> */}

      {/* SALES OPTIONS */}
      {/* <Typography variant="h6" sx={{ mb: 2 }}>
        Sales
      </Typography>

      <FormGroup>
        {OTHERS.map(({ label, value }) => (
          <CheckboxLabel
            key={value}
            label={label}
            checked={false}
            onChange={() => handleChangeSearchParams("sales", value)}
          />
        ))}
      </FormGroup>

      <Box component={Divider} my={3} /> */}

      {/* RATINGS FILTER */}
      {/* <Typography variant="h6" sx={{ mb: 2 }}>
        Ratings
      </Typography>

      <FormGroup>
        {[5, 4, 3, 2, 1].map((item) => (
          <CheckboxLabel
            key={item}
            checked={false}
            onChange={() => handleChangeSearchParams("rating", item.toString())}
            label={<Rating size="small" value={item} readOnly />}
          />
        ))}
      </FormGroup>

      <Box component={Divider} my={3} /> */}

      {/* COLORS VARIANT FILTER */}
      {/* <Typography variant="h6" sx={{ mb: 2 }}>
        Colors
      </Typography> */}
{/* 
      <FlexBox mb={2} flexWrap="wrap" gap={1.5}>
        {COLORS.map((item) => (
          <Box
            key={item}
            bgcolor={item}
            onClick={() => handleChangeSearchParams("color", item)}
            sx={{
              width: 25,
              height: 25,
              flexShrink: 0,
              outlineOffset: 1,
              cursor: "pointer",
              borderRadius: 3,
              outline: "1px solid #ccc",
            }}
          />
        ))} */}
      {/* </FlexBox> */}

      {/* {searchParams.size > 0 && (
        <Button
          fullWidth
          disableElevation
          color="error"
          variant="contained"
          onClick={handleClearFilters}
          sx={{ mt: 4 }}
        >
          Clear all filters
        </Button>
      )} */}
    </div>
  )
}
