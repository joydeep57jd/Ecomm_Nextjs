"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import ProductCard17 from "components/product-cards/product-card-17"
import { getOfferProducts } from "@/utils/api/offer"
import Product from "models/Product.model"
import { Item } from "@/models/Offer.model"
import Loading from "@/app/loading"

const PAGE_SIZE = 12

interface Props {
  offerId: number
  offerName: string
}

const mapItem = (item: Item): Product => ({
  id: item.itemId.toString(),
  slug: item.itemId.toString(),
  title: item.itemVariantName,
  price: item.finalSalePrice,
  discount: item.appliedOfferDiscount,
  thumbnail: item.primaryImageUrl,
  images: [item.primaryImageUrl],
  categories: [],
  stockQty: 0,
  variantId: item.itemVariantId
})

export default function OfferProductsPageView({ offerId, offerName }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  // const [totalRecords, setTotalRecords] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loader = useRef<HTMLDivElement | null>(null)
  const isFetching = useRef(false)
  const pageRef = useRef(1)

  const fetchProducts = useCallback(
    async (pageNum: number) => {
      if (isFetching.current) return
      isFetching.current = true
      setLoading(true)
      try {
        const response = await getOfferProducts(offerId, pageNum, PAGE_SIZE)
        const items = response?.data?.items ?? []
        const total = response?.data?.totalRecords ?? 0
        // setTotalRecords(total)
        setProducts((prev) => [...prev, ...items.map(mapItem)])
        setHasMore(pageNum * PAGE_SIZE < total)
      } finally {
        setLoading(false)
        isFetching.current = false
      }
    },
    [offerId]
  )

  useEffect(() => {
    fetchProducts(1)
  }, [offerId])

  useEffect(() => {
    if (!hasMore || loading) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          pageRef.current += 1
          fetchProducts(pageRef.current)
        }
      },
      { threshold: 0.1 }
    )
    if (loader.current) observer.observe(loader.current)
    return () => observer.disconnect()
  }, [hasMore, loading, fetchProducts])

  if (loading && products.length === 0) {
    return (
      <div style={{ position: "absolute", zIndex: 9, width: "100%" }}>
        <Loading isTiny={true} />
      </div>
    )
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        {offerName}
      </Typography>
      {/* <Typography variant="body2" color="text.secondary" mb={4}>
        {totalRecords} products found
      </Typography> */}

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid size={{ lg: 3, md: 4, sm: 6, xs: 12 }} key={`${product.id}-${product.variantId}`}>
            <ProductCard17 product={product} />
          </Grid>
        ))}
      </Grid>

      {hasMore && (
        <Box ref={loader} sx={{ mb: 6 }}>
          <Loading isTiny={true} />
        </Box>
      )}

      {!hasMore && products.length > 0 && (
        <Typography textAlign="center" color="text.secondary" py={4}>
          All products loaded
        </Typography>
      )}
    </Container>
  )
}
