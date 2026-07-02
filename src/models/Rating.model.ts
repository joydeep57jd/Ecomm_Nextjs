export interface SaveRatingRequest {
  itemId: number
  variantId: number
  customerId: number
  rating: number
  RatingId?: number
  note: string
  OrderdetailId:number
   Images?: ReviewImage[];
}
export interface ReviewImage {
  Name: string;
  ImageData: string; // Base64 encoded file
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




