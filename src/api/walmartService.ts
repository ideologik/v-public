// src/api/aliexpressService.ts
import axiosClient from "./axiosClient";
import { mapWalmartProductToUnified } from "../mappers/potentialProductMapper";
import { WalmartRawProduct } from "../types/walmartProduct";

// GET /io/Walmart
export const walmartGetByUpc = async (upc: string) => {
  try {
    const response = await axiosClient.get<{ items: WalmartRawProduct[] }>(
      `/Walmart?upc=${encodeURIComponent(upc)}`
    );
    const rawProducts = response.items || [];
    const mappedProducts = rawProducts.map(mapWalmartProductToUnified);

    return mappedProducts; // Retorna un array de WalmartProduct
  } catch (error) {
    console.error("Error fetching Walmart products by UPC:", error);
    throw error;
  }
};
