"use client"
import { useCallback, useEffect, useRef, useState } from "react"

export interface PlacePrediction {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
}

export interface PlaceDetails {
  lat: number
  lng: number
  formattedAddress: string
  pincode: string
  city: string
  state: string
  district: string
  country: string
}

interface UseGooglePlacesAutocompleteOptions {
  /** Restrict to specific country, e.g. "in" for India */
  country?: string
  /** Debounce delay in ms (default: 300) */
  debounceMs?: number
  /** Restrict result types, e.g. "address" */
  types?: string
}

export default function useGooglePlacesAutocomplete(
  options: UseGooglePlacesAutocompleteOptions = {}
) {
  const { country = "in", debounceMs = 300, types = "address" } = options

  const [predictions, setPredictions] = useState<PlacePrediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null)
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const attrContainerRef = useRef<HTMLDivElement | null>(null)

  // Initialize services once Google Maps script is loaded
  const initServices = useCallback(() => {
    if (!window.google?.maps?.places) return false

    if (!autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService()
    }
    if (!placesServiceRef.current) {
      // PlacesService needs a DOM element or map instance
      if (!attrContainerRef.current) {
        attrContainerRef.current = document.createElement("div")
      }
      placesServiceRef.current = new google.maps.places.PlacesService(attrContainerRef.current)
    }
    return true
  }, [])

  const getSessionToken = useCallback(() => {
    if (!sessionTokenRef.current && window.google?.maps?.places) {
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken()
    }
    return sessionTokenRef.current
  }, [])

  const resetSessionToken = useCallback(() => {
    sessionTokenRef.current = null
  }, [])

  /** Fetch autocomplete predictions (debounced) */
  const fetchPredictions = useCallback(
    (input: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      if (!input || input.length < 3) {
        setPredictions([])
        setLoading(false)
        return
      }

      setLoading(true)

      debounceTimerRef.current = setTimeout(() => {
        if (!initServices()) {
          setError("Google Maps not loaded")
          setLoading(false)
          return
        }

        const token = getSessionToken()

        const request: google.maps.places.AutocompletionRequest = {
          input,
          sessionToken: token!,
          componentRestrictions: country ? { country } : undefined,
          types: types ? [types] : undefined
        }

        autocompleteServiceRef.current!.getPlacePredictions(request, (results, status) => {
          setLoading(false)

          if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
            setPredictions([])
            if (status !== google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              setError(`Autocomplete failed: ${status}`)
            }
            return
          }

          setPredictions(
            results.map((r) => ({
              placeId: r.place_id,
              description: r.description,
              mainText: r.structured_formatting.main_text,
              secondaryText: r.structured_formatting.secondary_text
            }))
          )
        })
      }, debounceMs)
    },
    [country, debounceMs, types, initServices, getSessionToken]
  )

  /** Get detail for a selected place (uses same session token) */
  const getPlaceDetails = useCallback(
    (placeId: string): Promise<PlaceDetails> => {
      return new Promise((resolve, reject) => {
        if (!initServices()) {
          reject(new Error("Google Maps not loaded"))
          return
        }

        const token = getSessionToken()

        placesServiceRef.current!.getDetails(
          {
            placeId,
            fields: ["geometry", "formatted_address", "address_components"],
            sessionToken: token!
          },
          (place, status) => {
            // Destroy session token after selection
            resetSessionToken()

            if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
              reject(new Error(`Place details failed: ${status}`))
              return
            }

            const details = extractPlaceDetails(place)
            resolve(details)
          }
        )
      })
    },
    [initServices, getSessionToken, resetSessionToken]
  )

  /** Reverse geocode lat/lng to address */
  const reverseGeocode = useCallback((lat: number, lng: number): Promise<PlaceDetails> => {
    return new Promise((resolve, reject) => {
      if (!window.google?.maps) {
        reject(new Error("Google Maps not loaded"))
        return
      }

      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status !== google.maps.GeocoderStatus.OK || !results || results.length === 0) {
          reject(new Error(`Reverse geocode failed: ${status}`))
          return
        }

        const place = results[0]
        const details: PlaceDetails = {
          lat,
          lng,
          formattedAddress: place.formatted_address || "",
          ...extractAddressComponents(place.address_components || [])
        }
        resolve(details)
      })
    })
  }, [])

  /** Get current location and reverse geocode */
  const getCurrentLocation = useCallback((): Promise<PlaceDetails> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const details = await reverseGeocode(
              position.coords.latitude,
              position.coords.longitude
            )
            resolve(details)
          } catch (err) {
            reject(err)
          }
        },
        (err) => reject(new Error(`Geolocation error: ${err.message}`))
      )
    })
  }, [reverseGeocode])

  const clearPredictions = useCallback(() => {
    setPredictions([])
  }, [])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [])

  return {
    predictions,
    loading,
    error,
    fetchPredictions,
    getPlaceDetails,
    reverseGeocode,
    getCurrentLocation,
    clearPredictions
  }
}

// ─── Helpers ────────────────────────────────────────────────────

function extractPlaceDetails(place: google.maps.places.PlaceResult): PlaceDetails {
  const lat = place.geometry?.location?.lat() ?? 0
  const lng = place.geometry?.location?.lng() ?? 0
  const formattedAddress = place.formatted_address ?? ""
  const components = extractAddressComponents(place.address_components || [])
 

  return { lat, lng, formattedAddress, ...components }
}

function extractAddressComponents(components: google.maps.GeocoderAddressComponent[]) {
  let pincode = ""
  let city = ""
  let state = ""
  let district = ""
  let country = ""

  for (const c of components) {
    const types = c.types
    if (types.includes("postal_code")) pincode = c.long_name
    if (types.includes("locality")) city = c.long_name
    if (types.includes("administrative_area_level_1")) state = c.long_name
    if (types.includes("administrative_area_level_2")) district = c.long_name // often used as district in India
    if (types.includes("country")) country = c.long_name
  }

  return { pincode, city, state, district, country }
}
