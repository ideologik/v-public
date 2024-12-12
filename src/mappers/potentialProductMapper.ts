// src/mappers/potentialProductMapper.ts

import {
  AliExpressProduct,
  CJDropshippingProduct,
} from "../types/potentialProduct";

import defaultImage from "../assets/imgs/default-product-image.png";

// Mapper para AliExpress
// Recibe un objeto crudo de AliExpress
// y retorna un AliExpressProduct que extiende UnifiedProduct.
export function mapAliExpressProductToUnified(raw: any): AliExpressProduct {
  // Nombre del producto
  const name = raw.product_title || "No Name";
  // Imagen principal
  const mainImage = raw.product_main_image_url || defaultImage;

  // Para AliExpress no tenemos un array de imágenes extra en el ejemplo dado,
  // si tuvieras más imágenes, deberías agregarlas aquí.
  const images = [mainImage];

  // Categoría y subcategoría
  const category = raw.first_level_category_name || "N/A";
  const subcategory = raw.second_level_category_name || undefined;

  // Precio (parseamos target_sale_price a número)
  const price = raw.target_sale_price ? parseFloat(raw.target_sale_price) : 0;

  // URL de detalle (si existe)
  const detailUrl = raw.product_detail_url || undefined;

  return {
    platform: "AliExpress",
    name,
    image: mainImage,
    images,
    price,
    category,
    subcategory,
    detailUrl,
    // Campos específicos de AliExpress
    original_price: raw.original_price,
    product_small_image_urls: raw.product_small_image_urls,
    second_level_category_name: raw.second_level_category_name,
    product_detail_url: raw.product_detail_url,
    target_sale_price: raw.target_sale_price,
    second_level_category_id: raw.second_level_category_id,
    discount: raw.discount,
    product_main_image_url: raw.product_main_image_url,
    first_level_category_id: raw.first_level_category_id,
    target_sale_price_currency: raw.target_sale_price_currency,
    original_price_currency: raw.original_price_currency,
    shop_url: raw.shop_url,
    target_original_price_currency: raw.target_original_price_currency,
    product_id: raw.product_id,
    seller_id: raw.seller_id,
    target_original_price: raw.target_original_price,
    product_video_url: raw.product_video_url,
    first_level_category_name: raw.first_level_category_name,
    sale_price: raw.sale_price,
    product_title: raw.product_title,
    shop_id: raw.shop_id,
    sale_price_currency: raw.sale_price_currency,
    lastest_volume: raw.lastest_volume,
    evaluate_rate: raw.evaluate_rate,
  };
}

// Mapper para CJDropshipping
// Recibe un objeto crudo de CJDropshipping (ej: elemento del array data)
// y retorna un CJDropshippingProduct que extiende UnifiedProduct.
export function mapCJDropshippingProductToUnified(
  raw: any
): CJDropshippingProduct {
  // Nombre del producto
  const name = raw.nameEn || "No Name";

  // Parseamos las imágenes desde 'image' (un string JSON)
  let images: string[] = [];
  try {
    const parsedImages = JSON.parse(raw.image);
    images =
      Array.isArray(parsedImages) && parsedImages.length > 0
        ? parsedImages
        : [defaultImage];
  } catch {
    images = [defaultImage];
  }

  const mainImage = images[0];

  // Categoría y subcategoría
  let category = "N/A";
  let subcategory: string | undefined = undefined;
  if (raw.category) {
    const parts = raw.category.split(">");
    category = parts[0]?.trim() || "N/A";
    if (parts[1]) {
      subcategory = parts[1]?.trim();
    }
  }

  // Precio: tomamos el valor mínimo si es un rango
  let price = 0;
  if (raw.sellPrice) {
    const priceParts = raw.sellPrice
      .split("-")
      .map((p: string) => parseFloat(p));
    price = priceParts.length > 0 && !isNaN(priceParts[0]) ? priceParts[0] : 0;
  }

  // No se provee detailUrl en el ejemplo de CJ, dejamos undefined
  const detailUrl = undefined;

  // Parseamos arrays desde JSON (si son strings JSON):
  const parseJsonArray = (str: string | undefined): string[] | undefined => {
    if (!str) return undefined;
    try {
      const arr = JSON.parse(str);
      return Array.isArray(arr) ? arr : undefined;
    } catch {
      return undefined;
    }
  };

  const material = parseJsonArray(raw.material);
  const materialEn = parseJsonArray(raw.materialEn);
  const materialKey = parseJsonArray(raw.materialKey);
  const packing = parseJsonArray(raw.packing);
  const packingEn = parseJsonArray(raw.packingEn);
  const packingKey = parseJsonArray(raw.packingKey);
  const property = parseJsonArray(raw.property);
  const propertyEn = parseJsonArray(raw.propertyEn);
  const propertyKey = parseJsonArray(raw.propertyKey);
  const variantKey = parseJsonArray(raw.variantKey);
  const variantKeyEn = parseJsonArray(raw.variantKeyEn);

  // 'name' en la interfaz original es un array, lo parseamos si queremos
  const productNames = parseJsonArray(raw.name);

  return {
    platform: "CJDropshipping",
    name,
    image: mainImage,
    images,
    price,
    category,
    subcategory,
    detailUrl,
    // Campos específicos de CJDropshipping
    id: raw.id,
    bigImage: raw.bigImage,
    categoryId: raw.categoryId,
    description: raw.description,
    inventory: raw.inventory,
    material,
    materialEn,
    materialKey,
    originalNames: productNames,
    nameEn: raw.nameEn,
    packWeight: raw.packWeight,
    packing,
    packingEn,
    packingKey,
    property,
    propertyEn,
    propertyKey,
    saleStatus: raw.saleStatus,
    sellPrice: raw.sellPrice,
    sku: raw.sku,
    unit: raw.unit,
    variantKey,
    variantKeyEn,
    weight: raw.weight,
    addMarkStatus: raw.addMarkStatus,
    productType: raw.productType,
    listedNum: raw.listedNum,
    createAt: raw.createAt,
  };
}
