// src/api/aliexpressService.ts
import axiosClient from "./axiosClient";

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
    // Ajustar según si la API requiere body o query param
    return await axiosClient.post(
      `/ProductFinder/AliExpressFindByImage?image_url=${encodeURIComponent(
        imageUrl
      )}`
    );
  } catch (error) {
    console.error("Error finding by image:", error);
    throw error;
  }
};

// GET /io/ProductFinder/AliExpressGetProductByID
export const aliExpressGetProductByID = async (productId: string | number) => {
  try {
    return await axiosClient.get("ProductFinder/AliExpressGetProductByID", {
      params: { productId },
    });
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

// AliExpress direct endpoints
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
