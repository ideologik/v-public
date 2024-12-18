// src/api/aliexpressService.ts
import axiosClient from "./axiosClient";
import {
  mapAeMultimediaToImages,
  mapAliExpressProductToUnified,
} from "../mappers/potentialProductMapper";
import {
  AliExpressFindByImageResponse,
  AliExpressGetProductByIDResponse,
  AliExpressRawProduct,
} from "../types/aliexpressProduct";

// AliExpress en ProductFinder
// POST /io/ProductFinder/AliExpressFindByText
export const aliExpressFindByText = async (searchText: string) => {
  try {
    return await axiosClient.post("ProductFinder/AliExpressFindByText", {
      searchText,
    });
  } catch (error) {
    console.error("Error finding by text:", error);
    throw error;
  }
};

// POST /io/ProductFinder/AliExpressFindByImage
export const aliExpressFindByImage = async (imageUrl: string) => {
  try {
    const response = await axiosClient.post<AliExpressFindByImageResponse>(
      `/ProductFinder/AliExpressFindByImage?image_url=${encodeURIComponent(
        imageUrl
      )}`
    );
    const rawProducts: AliExpressRawProduct[] =
      response.aliexpress_ds_image_search_response.data.products
        .traffic_image_product_d_t_o;
    const mappedProducts = rawProducts.map(mapAliExpressProductToUnified);

    return mappedProducts;
  } catch (error) {
    console.error("Error finding by image:", error);
    throw error;
  }
};

export const getMediaByProductId = async (productId: string | number) => {
  try {
    const response = await aliExpressGetProductByID(productId);
    const productData: AliExpressGetProductByIDResponse = response;

    const multimedia =
      productData.aliexpress_ds_product_get_response.result
        .ae_multimedia_info_dto;

    const media = mapAeMultimediaToImages(multimedia);

    return media;
  } catch (error) {
    console.error("Error fetching media by product ID:", error);
    throw error;
  }
};

// GET /io / ProductFinder / AliExpressGetProductByID;
export const aliExpressGetProductByID = async (productId: string | number) => {
  try {
    return await axiosClient.get<AliExpressGetProductByIDResponse>(
      "ProductFinder/AliExpressGetProductByID",
      {
        params: { product_id: productId },
      }
    );
  } catch (error) {
    console.error("Error fetching AliExpress product by ID:", error);
    throw error;
  }
};

// GET /io/ProductFinder/AliExpressProductEnhancer
export const aliExpressProductEnhancer = async (productId: string | number) => {
  try {
    return await axiosClient.get("ProductFinder/AliExpressProductEnhancer", {
      params: { productId },
    });
  } catch (error) {
    console.error("Error enhancing product:", error);
    throw error;
  }
};

// GET /io/aliexpress/status
export const aliexpressStatus = async () => {
  try {
    return await axiosClient.get("aliexpress/status");
  } catch (error) {
    console.error("Error fetching aliexpress status:", error);
    throw error;
  }
};

// GET /io/aliexpress
export const aliexpressGet = async () => {
  try {
    return await axiosClient.get("aliexpress");
  } catch (error) {
    console.error("Error fetching aliexpress data:", error);
    throw error;
  }
};

// POST /io/aliexpress/Create
export const aliexpressCreate = async () => {
  try {
    return await axiosClient.post("aliexpress/Create");
  } catch (error) {
    console.error("Error creating aliexpress auth:", error);
    throw error;
  }
};
