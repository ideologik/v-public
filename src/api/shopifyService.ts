// src/api/shopifyService.ts
import axiosClient from "./axiosClient";

// GET /io/Shopify/status
export const shopifyStatus = async () => {
  try {
    return await axiosClient.get("Shopify/status");
  } catch (error) {
    console.error("Error fetching Shopify status:", error);
    throw error;
  }
};

// GET /io/Shopify/GetProducts
export const shopifyGetProducts = async () => {
  try {
    return await axiosClient.get("Shopify/GetProducts");
  } catch (error) {
    console.error("Error fetching Shopify products:", error);
    throw error;
  }
};

// POST /io/Shopify/CreateProduct
export const shopifyCreateProduct = async (product: any) => {
  try {
    return await axiosClient.post("Shopify/CreateProduct", product);
  } catch (error) {
    console.error("Error creating Shopify product:", error);
    throw error;
  }
};

// GET /io/Shopify/customerdata
export const shopifyCustomerData = async () => {
  try {
    return await axiosClient.get("Shopify/customerdata");
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw error;
  }
};

// GET /io/Shopify/deletecustomerdata
export const shopifyDeleteCustomerData = async () => {
  try {
    return await axiosClient.get("Shopify/deletecustomerdata");
  } catch (error) {
    console.error("Error deleting customer data:", error);
    throw error;
  }
};

// GET /io/Shopify/shopdata
export const shopifyShopData = async () => {
  try {
    return await axiosClient.get("Shopify/shopdata");
  } catch (error) {
    console.error("Error fetching shop data:", error);
    throw error;
  }
};

// GET /io/Shopify/appinstall
export const shopifyAppInstall = async () => {
  try {
    return await axiosClient.get("Shopify/appinstall");
  } catch (error) {
    console.error("Error fetching app install info:", error);
    throw error;
  }
};

// GET /io/Shopify/CreateIntegration
export const shopifyCreateIntegration = async () => {
  try {
    return await axiosClient.get("Shopify/CreateIntegration");
  } catch (error) {
    console.error("Error creating integration:", error);
    throw error;
  }
};
