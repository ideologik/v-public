// src/types/walmartProduct.d.ts
import { UnifiedProduct } from "./potentialProduct";

export interface WalmartSeller {
  sellerName?: string;
  address1?: string;
  city?: string;
  country?: string;
  zip?: string;
  csEmail?: string;
  csEscalationsEmail?: string;
  csPhone?: string;
  ccAboutUs?: string;
  ccTaxPolicy?: string | null;
  hasSellerBadge?: boolean;
}

export interface WalmartImageEntity {
  thumbnailImage: string;
  mediumImage: string;
  largeImage: string;
  entityType: string;
}

export interface WalmartWarning {
  Attribute: string;
  DisplayName: string;
  Value: string[];
}

export interface WalmartWarranty {
  warrantyInformation?: string;
  warrantyUrl?: string;
}

// Raw product recibido de la API de Walmart
export interface WalmartRawProduct {
  itemId: number;
  parentItemId: number;
  name: string;
  msrp?: number;
  salePrice?: number;
  upc?: string;
  categoryPath?: string;
  shortDescription?: string;
  longDescription?: string;
  brandName?: string;
  thumbnailImage?: string;
  mediumImage?: string;
  largeImage?: string;
  productTrackingUrl?: string;
  ninentySevenCentShipping?: boolean;
  standardShipRate?: number;
  size?: string;
  color?: string;
  marketplace?: boolean;
  modelNumber?: string;
  sellerInfo?: string;
  seller?: WalmartSeller;
  customerRating?: string;
  numReviews?: number;
  categoryNode?: string;
  bundle?: boolean;
  clearance?: boolean;
  preOrder?: boolean;
  stock?: string;
  freight?: boolean;
  gender?: string;
  age?: string;
  affiliateAddToCartUrl?: string;
  freeShippingOver35Dollars?: boolean;
  maxItemsInOrder?: number;
  giftOptions?: any;
  imageEntities?: WalmartImageEntity[];
  offerType?: string;
  isEDelivery?: boolean;
  availableOnline?: boolean;
  offerId?: string;
  warnings?: WalmartWarning[];
  productClassType?: string;
  warranty?: WalmartWarranty;
}

// Producto unificado para Walmart
export interface WalmartProduct extends UnifiedProduct {
  platform: "WalMart";

  // Campos específicos de Walmart
  itemId?: number;
  parentItemId?: number;
  msrp?: number;
  salePrice?: number;
  upc?: string;
  categoryPath?: string;
  shortDescription?: string;
  longDescription?: string;
  brandName?: string;
  thumbnailImage?: string;
  mediumImage?: string;
  largeImage?: string;
  productTrackingUrl?: string;
  ninentySevenCentShipping?: boolean;
  standardShipRate?: number;
  size?: string;
  color?: string;
  marketplace?: boolean;
  modelNumber?: string;
  sellerInfo?: string;
  seller?: WalmartSeller;
  customerRating?: string;
  numReviews?: number;
  categoryNode?: string;
  bundle?: boolean;
  clearance?: boolean;
  preOrder?: boolean;
  stock?: string;
  freight?: boolean;
  gender?: string;
  age?: string;
  affiliateAddToCartUrl?: string;
  freeShippingOver35Dollars?: boolean;
  maxItemsInOrder?: number;
  giftOptions?: any;
  imageEntities?: WalmartImageEntity[];
  offerType?: string;
  isEDelivery?: boolean;
  availableOnline?: boolean;
  offerId?: string;
  warnings?: WalmartWarning[];
  productClassType?: string;
  warranty?: WalmartWarranty;
}
