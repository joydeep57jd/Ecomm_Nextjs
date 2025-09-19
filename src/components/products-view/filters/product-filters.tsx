"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
// MUI
import Divider from "@mui/material/Divider"
// GLOBAL CUSTOM COMPONENTS
// LOCAL CUSTOM COMPONENTS
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
        <Accordion key={cat.variantOptionId} sx={{ mb: 1 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ padding: ".5rem 1rem", color: "grey.700" }}
          >
            <Typography fontWeight={600}>{cat.optionName}</Typography>
          </AccordionSummary>

          <AccordionDetails
            sx={{
              maxHeight: 250,
              overflowY: "auto",
              px: 0
            }}
          >
            {idx === 1 ? (
              <Box display="flex" flexWrap="wrap" gap={1.5} sx={{ pl: 2 }}>
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
                      display: "flex",
                      flexDirection: "column", // stack vertically
                      alignItems: "center", // center the content
                      gap: 0.5, // small gap between text and color box
                      "&:hover": {
                        borderColor: "primary.main",
                        color: "primary.main"
                      }
                    }}
                  >
                    <Typography>{opt.optionValueName}</Typography>

                    {/* Color box below the text */}
                    {opt.optionValueName && (
                      <Box
                        sx={{
                          width: "100%",
                          height: 10,
                          backgroundColor: opt.optionValueName,
                          borderRadius: "2px",
                          border: "1px solid #ccc"
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <FormGroup sx={{ pl: 2 }}>
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
          </AccordionDetails>
        </Accordion>
      ))}
      {/* <Box component={Divider} my={3} /> */}

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
