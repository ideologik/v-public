// src/api/productFinderService.ts
import axiosClient from "./axiosClient";

interface ProductFinderParams {
  searchText?: string;
  AmazonCategoryId?: number;
  AmazonSubCategoryId?: number;
  AmazonThirdCategoryId?: number;
  priceFrom?: number;
  priceTo?: number;
  sort_by?: string;
  page?: number;
  total_rows?: number;
}

// GET /io/ProductFinder
export const getProductsFinder = async (params: ProductFinderParams) => {
  try {
    return await axiosClient.get("ProductFinder", { params });
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};

// GET /io/ProductFinder/ProductDetails
export const getProductDetails = async (productId: string | number) => {
  try {
    return await axiosClient.get("ProductFinder/ProductDetails", {
      params: { productId },
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};

// GET /io/ProductFinder/Categories
export const getProductFinderCategories = async (includeChild = true) => {
  try {
    return await axiosClient.get(
      `/io/ProductFinder/Categories?include_child=${includeChild}`
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// GET /io/ProductFinder/SubCategories
export const getProductFinderSubCategories = async (
  parent_categoryId: number,
  includeChild = true
) => {
  try {
    return await axiosClient.get("ProductFinder/SubCategories", {
      params: { include_child: includeChild, parent_categoryId },
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

// GET /io/ProductFinder/PriceRange
export const getProductFinderPriceRange = async () => {
  try {
    return await axiosClient.get("ProductFinder/PriceRange");
  } catch (error) {
    console.error("Error fetching price range:", error);
    throw error;
  }
};

// GET /io/ProductFinder/GenerateProductImage
export const generateProductImage = async (productId: string | number) => {
  try {
    return await axiosClient.get("ProductFinder/GenerateProductImage", {
      params: { productId },
    });
  } catch (error) {
    console.error("Error generating product image:", error);
    throw error;
  }
};
