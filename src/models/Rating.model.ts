export interface SaveRatingRequest {
  itemId: number
  variantId: number
  customerId: number
  rating: number
  RatingId?: number
  note: string
  OrderdetailId:number
  Images?: File[];
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
  images:       string[];
}




