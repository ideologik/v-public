import { UnifiedProduct } from "./potentialProduct";
export interface CJDropshippingProduct extends UnifiedProduct {
  platform: "CJDropshipping";

  id?: string;
  bigImage?: string;
  categoryId?: string;
  description?: string;
  inventory?: any;
  material?: string[];
  materialEn?: string[];
  materialKey?: string[];
  originalNames?: string[];
  nameEn?: string;
  packWeight?: string;
  packing?: string[];
  packingEn?: string[];
  packingKey?: string[];
  property?: string[];
  propertyEn?: string[];
  propertyKey?: string[];
  saleStatus?: string;
  sellPrice?: string;
  sku?: string;
  unit?: string | null;
  variantKey?: string[];
  variantKeyEn?: string[];
  weight?: string;
  addMarkStatus?: number;
  productType?: string;
  listedNum?: number;
  createAt?: number; // timestamp
}

export interface CJRawProduct {
  id: string;
  bigImage: string;
  category: string;
  categoryId: string;
  description: string;
  image: string;
  inventory: any;
  material: string;
  materialEn: string;
  materialKey: string;
  name: string;
  nameEn: string;
  packWeight: string;
  packing: string;
  packingEn: string;
  packingKey: string;
  property: string;
  propertyEn: string;
  propertyKey: string;
  saleStatus: string;
  sellPrice: string;
  sku: string;
  unit: string | null;
  variantKey: string;
  variantKeyEn: string;
  weight: string;
  addMarkStatus: number;
  productType: string;
  listedNum: number;
  createAt: number;
}

export interface CJSearchByImageResponse {
  code: number;
  result: boolean;
  message: string;
  data: CJRawProduct[];
  requestId: string;
  success: boolean;
}
