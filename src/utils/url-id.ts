// Base64 id obfuscation, mirroring the scheme used by the offer / sales pages
// (see app/sales/[slug]/page.tsx). Used to keep raw numeric ids (product id,
// variantId, ...) out of product URLs. Works on both the server (Buffer) and
// the client (btoa/atob).

export const encodeId = (id: string | number): string => {
  const value = String(id ?? "")
  if (!value) return ""
  return typeof window === "undefined"
    ? Buffer.from(value).toString("base64")
    : btoa(value)
}

export const decodeId = (encoded: string): string => {
  if (!encoded) return ""
  try {
    const value = decodeURIComponent(encoded)
    return typeof window === "undefined"
      ? Buffer.from(value, "base64").toString("utf-8")
      : atob(value)
  } catch {
    return ""
  }
}
