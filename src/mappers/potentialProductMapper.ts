// src/mappers/potentialProductMapper.ts

import defaultImage from "../assets/images/default-product-image.png";
import {
  AeMultimediaInfoDto,
  AliExpressProduct,
} from "../types/aliexpressProduct";
import { CJDropshippingProduct } from "../types/cjdropshippingProduct";
import { WalmartRawProduct, WalmartProduct } from "../types/walmartProduct";

export function mapAliExpressProductToUnified(raw: any): AliExpressProduct {
  const name = raw.product_title || "No Name";
  const mainImage = raw.product_main_image_url || defaultImage;

  // Para AliExpress no tenemos un array de imágenes extra
  const images = [mainImage];

  const category = raw.first_level_category_name || "N/A";
  const subcategory = raw.second_level_category_name || undefined;

  const price = raw.target_sale_price ? parseFloat(raw.target_sale_price) : 0;

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

export function mapAeMultimediaToImages(
  aeMultimedia?: AeMultimediaInfoDto
): string[] {
  const result: string[] = [];

  if (!aeMultimedia) return result;

  // Procesamos las imágenes
  if (aeMultimedia.image_urls) {
    const urls = aeMultimedia.image_urls
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);
    result.push(...urls);
  }

  // Videos
  if (aeMultimedia.ae_video_dtos?.ae_video_d_t_o) {
    for (const video of aeMultimedia.ae_video_dtos.ae_video_d_t_o) {
      if (video.video_url) {
        result.push(video.video_url);
      }
    }
  }

  return result;
}

export function mapCJDropshippingProductToUnified(
  raw: any
): CJDropshippingProduct {
  const name = raw.nameEn || "No Name";

  //  'image' (un string JSON)
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

  let category = "N/A";
  let subcategory: string | undefined = undefined;
  if (raw.category) {
    const parts = raw.category.split(">");
    category = parts[0]?.trim() || "N/A";
    if (parts[1]) {
      subcategory = parts[1]?.trim();
    }
  }

  let price = 0;
  if (raw.sellPrice) {
    const priceParts = raw.sellPrice
      .split("-")
      .map((p: string) => parseFloat(p));
    price = priceParts.length > 0 && !isNaN(priceParts[0]) ? priceParts[0] : 0;
  }

  // TODO: 'detailUrl' armarlo con el ID del producto
  const detailUrl = undefined;

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

export function mapWalmartProductToUnified(
  raw: WalmartRawProduct
): WalmartProduct {
  const name = raw.name || "No Name";

  const images: string[] = [];
  if (Array.isArray(raw.imageEntities) && raw.imageEntities.length > 0) {
    for (const img of raw.imageEntities) {
      if (img.largeImage) {
        images.push(img.largeImage);
      } else if (img.mediumImage) {
        images.push(img.mediumImage);
      } else if (img.thumbnailImage) {
        images.push(img.thumbnailImage);
      }
    }
  } else {
    if (raw.largeImage) images.push(raw.largeImage);
    else if (raw.mediumImage) images.push(raw.mediumImage);
    else if (raw.thumbnailImage) images.push(raw.thumbnailImage);
  }

  if (images.length === 0) {
    images.push(defaultImage);
  }

  const mainImage = images[0];

  let category = "N/A";
  let subcategory: string | undefined = undefined;
  if (raw.categoryPath) {
    const parts = raw.categoryPath.split("/");
    category = parts[0]?.trim() || "N/A";
    if (parts[1]) {
      subcategory = parts[1]?.trim();
    }
  }

  // Precio: si no hay salePrice, uso msrp ¿es ok?
  const price = raw.salePrice ?? raw.msrp ?? 0;

  // armar el URL de detalle
  const detailUrl = undefined;

  return {
    platform: "WalMart",
    name,
    image: mainImage,
    images,
    price,
    category,
    subcategory,
    detailUrl,
    // Campos específicos de Walmart
    itemId: raw.itemId,
    parentItemId: raw.parentItemId,
    msrp: raw.msrp,
    salePrice: raw.salePrice,
    upc: raw.upc,
    categoryPath: raw.categoryPath,
    shortDescription: raw.shortDescription,
    longDescription: raw.longDescription,
    brandName: raw.brandName,
    thumbnailImage: raw.thumbnailImage,
    mediumImage: raw.mediumImage,
    largeImage: raw.largeImage,
    productTrackingUrl: raw.productTrackingUrl,
    ninentySevenCentShipping: raw.ninentySevenCentShipping,
    standardShipRate: raw.standardShipRate,
    size: raw.size,
    color: raw.color,
    marketplace: raw.marketplace,
    modelNumber: raw.modelNumber,
    sellerInfo: raw.sellerInfo,
    seller: raw.seller,
    customerRating: raw.customerRating,
    numReviews: raw.numReviews,
    categoryNode: raw.categoryNode,
    bundle: raw.bundle,
    clearance: raw.clearance,
    preOrder: raw.preOrder,
    stock: raw.stock,
    freight: raw.freight,
    gender: raw.gender,
    age: raw.age,
    affiliateAddToCartUrl: raw.affiliateAddToCartUrl,
    freeShippingOver35Dollars: raw.freeShippingOver35Dollars,
    maxItemsInOrder: raw.maxItemsInOrder,
    giftOptions: raw.giftOptions,
    imageEntities: raw.imageEntities,
    offerType: raw.offerType,
    isEDelivery: raw.isEDelivery,
    availableOnline: raw.availableOnline,
    offerId: raw.offerId,
    warnings: raw.warnings,
    productClassType: raw.productClassType,
    warranty: raw.warranty,
  };
}
