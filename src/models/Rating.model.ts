export interface SaveRatingRequest {
  itemId: number
  variantId: number
  customerId: number
  rating: number
  note: string
}

export interface GetReviewPayload {
  CategoryId: null
  ReviewStatus: number
  ItemVariantId: number
}

export interface GetReviewResponse {
  ratingId:     number;
  itemCode:     string;
  name:         string;
  review:       string;
  reviewStatus: number;
  rating:       number;
  customerName: string;
  createdDate:  Date;
}




