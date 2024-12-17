export type Platform =
  | "AliExpress"
  | "CJDropshipping"
  | "WalMart"
  | "Amazon"
  | "Shopify"
  | "eBay";

export interface UnifiedProduct {
  platform: Platform;

  // Campos comunes
  name: string;
  image: string;
  images: string[];
  price: number;
  category: string;
  subcategory?: string;
  detailUrl?: string;
}
