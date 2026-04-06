"use client"
import { useRef, useState } from "react"
import MuiTextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import CircularProgress from "@mui/material/CircularProgress"
import Tooltip from "@mui/material/Tooltip"
import MyLocation from "@mui/icons-material/MyLocation"
import LocationOn from "@mui/icons-material/LocationOn"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import useGooglePlacesAutocomplete, {
  PlaceDetails,
  PlacePrediction
} from "@/hooks/useGooglePlacesAutocomplete"

interface AddressAutocompleteProps {
  /** Called when user selects an address (from autocomplete or current location) */
  onAddressSelect: (details: PlaceDetails) => void
  /** Default input value */
  defaultValue?: string
  /** MUI TextField label */
  label?: string
  /** Error state */
  error?: boolean
  /** Helper text */
  helperText?: string
}

export default function AddressAutocomplete({
  onAddressSelect,
  defaultValue = "",
  label = "Search Address",
  error,
  helperText
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(defaultValue)
  const [locating, setLocating] = useState(false)
  const prevInputRef = useRef("")

  const {
    predictions,
    loading,
    fetchPredictions,
    getPlaceDetails,
    getCurrentLocation,
    clearPredictions
  } = useGooglePlacesAutocomplete({ country: "in", debounceMs: 300, types: "address" })

  const handleInputChange = (_: unknown, value: string, reason: string) => {
    setInputValue(value)
    if (reason === "input" && value !== prevInputRef.current) {
      prevInputRef.current = value
      fetchPredictions(value)
    }
    if (reason === "clear") {
      clearPredictions()
    }
  }

  const handleSelect = async (_: unknown, option: string | PlacePrediction | null) => {
    if (!option || typeof option === "string") return
    try {
      const details = await getPlaceDetails(option.placeId)
      setInputValue(details.formattedAddress)
      clearPredictions()
      onAddressSelect(details)
    } catch (err) {
      console.error("Failed to get place details:", err)
    }
  }

  const handleUseCurrentLocation = async () => {
    setLocating(true)
    try {
      const details = await getCurrentLocation()
      setInputValue(details.formattedAddress)
      clearPredictions()
      onAddressSelect(details)
    } catch (err) {
      console.error("Failed to get current location:", err)
    } finally {
      setLocating(false)
    }
  }

  return (
    <Autocomplete
      freeSolo
      filterOptions={(x) => x}
      options={predictions}
      getOptionLabel={(option) => (typeof option === "string" ? option : option.description)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      loading={loading}
      noOptionsText="Type to search address"
      renderOption={(props, option) => (
        <li {...props} key={option.placeId}>
          <LocationOn sx={{ color: "text.secondary", mr: 1 }} fontSize="small" />
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {option.mainText}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.secondaryText}
            </Typography>
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <MuiTextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          fullWidth
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  {loading && <CircularProgress size={18} />}
                  {params.InputProps.endAdornment}
                  <Tooltip title="Use current location">
                    <span>
                      <IconButton
                        onClick={handleUseCurrentLocation}
                        disabled={locating}
                        size="small"
                        edge="end"
                      >
                        {locating ? (
                          <CircularProgress size={18} />
                        ) : (
                          <MyLocation fontSize="small" />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </InputAdornment>
              )
            }
          }}
        />
      )}
    />
  )
}
