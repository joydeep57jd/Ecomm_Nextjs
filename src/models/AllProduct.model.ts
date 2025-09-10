

export interface AllProductResponse {
    dataList:   DataList[];
    pagination: Pagination;
}

export interface DataList {
    id:            string;
    itemId:        number;
    itemName:      string;
    itemDesc:      string;
    mrp:           number;
    savePrice:     number;
    savePricePctg: number;
    memberPrice:   number;
    categoryId:    number;
    subCategoryId: number;
    isSoldOut:     boolean;
    itemCode:      string;
    imageList:     ImageList[];
}

export interface ImageList {
    id:            number;
    name:          string;
    alt:           string;
    fullImagepath: string;
}

export interface Pagination {
    pageNumber:   number;
    pageSize:     number;
    totalRecords: number;
}

export interface ProductRequestPayload {
  
  searchCriteria?: string | null
  categoryId?: number
  subCategoryId?: number | null
  pageNo?: number | null
  pageSize?: number | null
}

