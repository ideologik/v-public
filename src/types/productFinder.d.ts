// src/types/productFinder.d.ts

export interface Category {
  category: string;
  categoryId: number;
  subCategories: Category[];
}

export interface BestsellerProduct {
  bes_id: number;
  bes_date: string; // ISO date
  bes_upc: string | null;
  bes_asin: string | null;
  bes_parentASIN: string | null;
  bes_salesrank: number | null;
  bes_salesrank90DaysAverage: number | null;
  bes_price: number | null;
  bes_categoryCode: string | null;
  bes_productGroup: string | null;
  bes_productGroupId: number | null;
  bes_productSubGroup: string | null;
  bes_productSubGroupId: number | null;
  bes_productThirdGroup: string | null;
  bes_productThirdGroupId: number | null;
  bes_dimensions: string | null;
  bes_title: string;
  bes_timestamp: string; // ISO date
  bes_link: string;
  bes_amazonTitle: string | null;
  bes_brand: string | null;
  bes_FBAFees: string | null; // JSON string
  bes_position: number | null;
  bes_boughtInPastMonth: number | null;
  bes_rating: number | null;
  bes_reviewCount: number | null;
  bes_priceBuyBoxCurrent: number | null;
  bes_priceBuyBox90DaysAverage: number | null;
  bes_priceAmazonCurrent: number | null;
  bes_priceAmazon90DaysAverage: number | null;
  bes_priceNewThirdPartyCurrent: number | null;
  bes_priceNewThirdParty90DaysAverage: number | null;
  bes_priceNewFBMCurrent: number | null;
  bes_priceNewFBM90DaysAverage: number | null;
  bes_priceNewFBA: number | null;
  bes_priceNewFBA90DaysAverage: number | null;
  bes_FBAPickAndPackFee: number | null;
  bes_priceEbayNewCurrent: number | null;
  bes_priceEbayNew90DaysAverage: number | null;
  bes_newOfferCount: number | null;
  bes_newOfferCount90DaysAverage: number | null;
  bes_imageURLs: string | null; // Comma-separated URLs
}

export interface BestsellerProducts {
  total_records: number;
  data: BestsellerProduct[];
}

export interface ProductFinderParams {
  AmazonCategoryId?: number;
  AmazonSubCategoryId?: number;
  AmazonThirdCategoryId?: number;
  priceFrom?: number; // default 0
  priceTo?: number; // default 0
  searchText?: string;
  sort_by?: number; // integer, default?
  page?: number;
  total_rows?: number;
}

// Interfaces para el histórico de datos
export interface ProductHistoryCount {
  date: string; // ISO date
  count: number;
}

export interface ProductHistoryPrice {
  date: string; // ISO date
  price: number;
}

export interface CategorySalesRank {
  date: string;
  salesrank: number;
}

export interface CategoryAndSalesRank {
  category_id: number;
  dateAndSalesRank: CategorySalesRank[];
}

// Respuesta de Product Details con datos históricos adicionales
export interface BestsellerProductDetails extends BestsellerProduct {
  historyMonthlySold?: ProductHistoryCount[];
  historySellersCount?: ProductHistoryCount[];
  historyRating?: ProductHistoryCount[];
  historyAmazonPriceTrend?: ProductHistoryPrice[];
  historyNewPriceTrend?: ProductHistoryPrice[];
  historyReviewsCount?: ProductHistoryCount[];
  historyEbayPrice?: ProductHistoryPrice[];
  categoryAndSalesRanks?: CategoryAndSalesRank[];
}
