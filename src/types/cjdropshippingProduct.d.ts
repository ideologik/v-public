import { UnifiedProduct } from "./potentialProduct";
export interface CJDropshippingProduct extends UnifiedProduct {
  platform: "CJDropshipping";

  // Datos específicos de CJDropshipping
  id?: string;
  bigImage?: string;
  categoryId?: string;
  description?: string;
  inventory?: any; // Tipo desconocido en el ejemplo, podría ser number o null
  material?: string[]; // Parseado desde el JSON de "material"
  materialEn?: string[]; // Parseado desde el JSON de "materialEn"
  materialKey?: string[]; // Parseado desde el JSON de "materialKey"
  originalNames?: string[]; // Campo original, 'nameEn' se usa para UnifiedProduct.name
  nameEn?: string; // Título del producto en inglés
  packWeight?: string; // Peso del paquete, string convertible a number
  packing?: string[]; // Parseado desde el JSON "packing"
  packingEn?: string[];
  packingKey?: string[];
  property?: string[]; // Parseado desde "property"
  propertyEn?: string[];
  propertyKey?: string[];
  saleStatus?: string;
  sellPrice?: string; // Ej: "25.84-34.5", se parsea el mínimo para UnifiedProduct.price
  sku?: string;
  unit?: string | null;
  variantKey?: string[];
  variantKeyEn?: string[];
  weight?: string; // Peso en string, podría convertirse a number
  addMarkStatus?: number;
  productType?: string;
  listedNum?: number;
  createAt?: number; // timestamp
}

// Raw product from CJDropshipping API
export interface CJRawProduct {
  id: string;
  bigImage: string;
  category: string;
  categoryId: string;
  description: string;
  image: string; // JSON string con array de URLs
  inventory: any;
  material: string; // JSON string array ej. ["塑料","其他"]
  materialEn: string; // JSON string array ej. ["Plastic","Others"]
  materialKey: string; // JSON string array ej. ["PLASTIC","MATERIAL"]
  name: string; // JSON string array con varios nombres
  nameEn: string;
  packWeight: string;
  packing: string; // JSON string array ej. ["塑料袋"]
  packingEn: string; // JSON string array
  packingKey: string; // JSON string array
  property: string; // JSON string array ej. ["电子"]
  propertyEn: string; // JSON string array
  propertyKey: string; // JSON string array
  saleStatus: string;
  sellPrice: string; // Ej. "25.84-34.5"
  sku: string;
  unit: string | null;
  variantKey: string; // JSON string array ej. ["颜色"]
  variantKeyEn: string; // JSON string array ej. ["Color"]
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
