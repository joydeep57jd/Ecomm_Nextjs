"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
// MUI
// GLOBAL CUSTOM COMPONENTS
// LOCAL CUSTOM COMPONENTS
// TYPES
import { GetCategoryResponse } from "@/models/Category.modal"
import { useEffect, useState } from "react"
import { Box, Divider, Slider, TextField } from "@mui/material"
import { FlexBetween } from "@/components/flex-box"

interface Props {
  categoryOptions: GetCategoryResponse[]
}

let timeoutId: NodeJS.Timeout
export default function ProductFilters({ categoryOptions }: Props) {
  const [selectedFilters, setSelectedFilters] = useState<Record<number, Record<string, number[]>>>({})
  const [selectedVariant, setSelectedVariant] = useState<Record<number, Record<string, number[]>>>({})
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 })
  const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>([0, 10000])
  const [isFirstRangeChange, setIsFirstRangeChange] = useState(true)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("filter")) {
      const filter = getCurrentFilters("filter")
      setSelectedFilters({ ...filter })
    } else {
      setSelectedFilters({})
    }
    if (searchParams.get("variantFilter")) {
      const filter = getCurrentFilters("variantFilter")
      setSelectedVariant({ ...filter })
    } else {
      setSelectedVariant({})
    }
  }, [router, searchParams])

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      if (!isFirstRangeChange) {
        updatePriceRangeParams()
      } else {
        setIsFirstRangeChange(false)
      }
    }, 500)
  }, [selectedPriceRange])

  const updatePriceRangeParams = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("price", btoa(JSON.stringify(selectedPriceRange)))
    router.push(`${pathname}?${params.toString()}`)
  }

  const getCurrentFilters = (keyName: string) => {
    const encodedFilters = searchParams.get(keyName) ?? btoa(JSON.stringify({}))
    const filters = JSON.parse(atob(encodedFilters))
    return filters
  }

  const changeMaxRange = (newMax: number) => {
    setPriceRange(prev => ({ ...prev, max: (newMax > prev.min) ? newMax : prev.max }))
    if (newMax < selectedPriceRange[1]) {
      setSelectedPriceRange(prev => [prev[0], newMax])
    }
  }

  const changeMinRange = (newMin: number) => {
    setPriceRange(prev => ({ ...prev, min: (newMin >= 0 && newMin < prev.max) ? newMin : prev.min }))
    if (newMin > selectedPriceRange[0]) {
      setSelectedPriceRange(prev => [newMin, prev[1]])
    }
  }

  const handleChangeSearchParams = (
    categoryId: number,
    value: number,
    keyName: string,
    appliedOnVariant: boolean
  ) => {
    const params = new URLSearchParams(searchParams.toString())
    try {
      const paramsKeyName = appliedOnVariant ? "filter" : "variantFilter"
      const filters = getCurrentFilters(paramsKeyName)

      if (!filters[categoryId]) {
        filters[categoryId] = {}
      }
      const options = (appliedOnVariant ? selectedFilters : selectedVariant)[categoryId] ?? {}
      const values = options[keyName] ?? []
      const existingValueIndex = values.findIndex((id) => id === value)
      if (existingValueIndex !== -1) {
        values.splice(existingValueIndex, 1)
      } else {
        values.push(value)
      }

      filters[categoryId][keyName] = values
      appliedOnVariant ? setSelectedFilters({ ...filters }) : setSelectedVariant({ ...filters })

      params.set(paramsKeyName, btoa(JSON.stringify(filters)))
      router.push(`${pathname}?${params.toString()}`)
    } catch { }
  }

  return (
    <div>
      {categoryOptions.map((cat) => (
        <Accordion key={cat.variantOptionId} sx={{
          boxShadow: "none",
          "&:not(:last-child)": { borderBottom: 0 },
          "&:before": { display: "none" }
        }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              padding: 0,
              minHeight: 48,
              boxShadow: "none",
              "& .Mui-expanded": { color: "primary.main", margin: 0 },
              "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                margin: 0,
                "& .MuiSvgIcon-root": { color: "primary.main" }
              }
            }}
          >
            <Typography fontWeight={600}>{cat.optionName}</Typography>
          </AccordionSummary>

          <AccordionDetails
            sx={{
              maxHeight: 350,
              overflowY: "auto",
              px: 0
            }}
          >
            <FormGroup sx={{ pl: 2 }}>
              {cat.optionValues.map((opt) => (
                <Box
                  key={opt.optionValueId}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative"
                  }}
                >
                  {cat.optionName.toLowerCase().includes("colour") && (
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: opt.optionValueName,
                        borderRadius: "100%",
                        border: "1px solid #ccc",
                        position: "absolute",
                        left: "25px"
                      }}
                    />
                  )}
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={
                          cat.appliedOnVariant
                            ? !!selectedFilters[cat.categoryId]?.[cat.optionName]?.includes(
                              opt.optionValueId
                            )
                            : !!selectedVariant[cat.categoryId]?.[cat.optionName]?.includes(
                              opt.optionValueId
                            )
                        }
                        onChange={() =>
                          handleChangeSearchParams(
                            cat.categoryId,
                            opt.optionValueId,
                            cat.optionName,
                            cat.appliedOnVariant
                          )
                        }
                      />
                    }
                    label={opt.optionValueName}
                    sx={{
                      fontSize: 14,
                      color: "grey.600",
                      "& .MuiFormControlLabel-label": {
                        marginLeft: cat.optionName.toLowerCase().includes("colour") ? "22px " : 0
                      }
                    }}
                  />
                </Box>
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      ))}
      {
        categoryOptions.length &&
        <Box sx={{}}>
          <Box component={Divider} my={3} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Price Range
          </Typography>

          <Slider
            min={priceRange.min}
            max={priceRange.max}
            size="small"
            value={selectedPriceRange}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}`}
            onChange={(_, v) => setSelectedPriceRange(v)}
          />

          <FlexBetween>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder="0"
              value={priceRange.min}
              onChange={(e) => changeMinRange(+(e.target.value || 0))
              }
            />

            <Typography variant="h5" sx={{ px: 1, color: "grey.600" }}> - </Typography>

            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder="250"
              value={priceRange.max}
              onChange={(e) => changeMaxRange(+(e.target.value || 0))
              }
            />
          </FlexBetween>
        </Box>
      }
    </div>
  )
}
