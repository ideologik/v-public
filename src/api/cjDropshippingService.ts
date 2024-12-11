// src/api/cjDropshippingService.ts
import axiosClient from "./axiosClient";

// GET /api/CJDropshipping/Status
export const cjDropshippingStatus = async () => {
  try {
    return await axiosClient.get("/api/CJDropshipping/Status");
  } catch (error) {
    console.error("Error fetching CJ Dropshipping status:", error);
    throw error;
  }
};

// GET /api/CJDropshipping/create
export const cjDropshippingCreate = async () => {
  try {
    return await axiosClient.get("/api/CJDropshipping/create");
  } catch (error) {
    console.error("Error creating CJ Dropshipping:", error);
    throw error;
  }
};

// GET /api/CJDropshipping/SearchByImage
export const cjDropshippingSearchByImage = async () => {
  try {
    return await axiosClient.get("/api/CJDropshipping/SearchByImage");
  } catch (error) {
    console.error("Error searching by image:", error);
    throw error;
  }
};
