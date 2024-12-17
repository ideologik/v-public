import { UnifiedProduct } from "./potentialProduct";
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

// Raw product from AliExpress API
export interface AliExpressRawProduct {
  original_price: string;
  product_small_image_urls: {
    _string: string | null;
  };
  second_level_category_name: string;
  product_detail_url: string;
  target_sale_price: string;
  second_level_category_id: string;
  discount: string;
  product_main_image_url: string;
  first_level_category_id: string;
  target_sale_price_currency: string;
  original_price_currency: string;
  shop_url: string;
  target_original_price_currency: string;
  product_id: string;
  seller_id: number;
  target_original_price: string;
  product_video_url: string;
  first_level_category_name: string;
  sale_price: string;
  product_title: string;
  shop_id: number;
  sale_price_currency: string;
  lastest_volume: string;
  evaluate_rate: string | null;
}

export interface AliExpressFindByImageResponse {
  aliexpress_ds_image_search_response: {
    data: {
      total_record_count: number;
      products: {
        traffic_image_product_d_t_o: AliExpressRawProduct[];
      };
    };
    rsp_code: string;
    rsp_msg: string;
    request_id: string;
  };
}

export interface AliExpressGetProductByIDResponse {
  aliexpress_ds_product_get_response: {
    result: {
      ae_multimedia_info_dto?: AeMultimediaInfoDto;
      [key: string]: any;
    };
    rsp_code: number;
    rsp_msg: string;
    request_id: string;
  };
}

// Multimedia
export interface AeVideoDto {
  video_id: string;
  video_url: string;
  [key: string]: any; // Otros campos que puedan existir
}

export interface AeVideoDtos {
  ae_video_d_t_o: AeVideoDto[];
}

export interface AeMultimediaInfoDto {
  ae_video_dtos?: AeVideoDtos | null;
  image_urls?: string; // String con URLs separadas por punto y coma
}
