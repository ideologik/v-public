export interface UnifiedProduct {
  platform: "AliExpress" | "CJDropshipping";
  // Campos comunes a ambas plataformas
  name: string;
  image: string; // Primera imagen principal
  images: string[]; // Array de todas las imágenes
  price: number; // Precio principal del producto (por ejemplo, mínimo del rango)
  category: string; // Categoría principal
  subcategory?: string; // Subcategoría si existe
  detailUrl?: string; // URL del detalle del producto (si aplica)
}

export interface AliExpressProduct extends UnifiedProduct {
  platform: "AliExpress";

  // Datos de AliExpress provenientes del ejemplo:
  original_price?: string;
  product_small_image_urls?: {
    _string: string | null;
  };
  second_level_category_name?: string;
  product_detail_url?: string; // También podría usarse como detailUrl común
  target_sale_price?: string;
  second_level_category_id?: string;
  discount?: string;
  product_main_image_url?: string; // Esta suele mapearse a image (usada en UnifiedProduct)
  first_level_category_id?: string;
  target_sale_price_currency?: string;
  original_price_currency?: string;
  shop_url?: string;
  target_original_price_currency?: string;
  product_id?: string;
  seller_id?: number;
  target_original_price?: string;
  product_video_url?: string;
  first_level_category_name?: string; // Mapeada a category (UnifiedProduct)
  sale_price?: string;
  product_title?: string; // Mapeado a name (UnifiedProduct)
  shop_id?: number;
  sale_price_currency?: string;
  lastest_volume?: string;
  evaluate_rate?: string | null;
}

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
