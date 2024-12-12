// src/api/cjDropshippingService.ts
import { mapCJDropshippingProductToUnified } from "../mappers/potentialProductMapper";
import {
  CJRawProduct,
  CJSearchByImageResponse,
} from "../types/potentialProduct";
import axiosClient from "./axiosClient";

// GET /api/CJDropshipping/Status
export const cjDropshippingStatus = async () => {
  try {
    return await axiosClient.get("/CJDropshipping/Status");
  } catch (error) {
    console.error("Error fetching CJ Dropshipping status:", error);
    throw error;
  }
};

// GET /api/CJDropshipping/create
export const cjDropshippingCreate = async () => {
  try {
    return await axiosClient.get("/CJDropshipping/create");
  } catch (error) {
    console.error("Error creating CJ Dropshipping:", error);
    throw error;
  }
};

// GET /api/CJDropshipping/SearchByImage
export const getCjDropshippingByImage = async (imageUrl: string) => {
  try {
    const response = await axiosClient.get<CJSearchByImageResponse>(
      `/CJDropshipping/SearchByImage?imageURL=${encodeURIComponent(imageUrl)}`
    );
    const rawProducts: CJRawProduct[] = response.data;
    const mappedProducts = rawProducts.map(mapCJDropshippingProductToUnified);
    return mappedProducts;
  } catch (error) {
    console.error("Error searching by image:", error);
    throw error;
  }
};
