// src/api/productFinderService.ts

import {
  ProductFinderParams,
  BestsellerProducts,
  BestsellerProduct,
  BestsellerProductDetails,
  Category,
} from "../types/productFinder";

import axiosClient from "./axiosClient";

// GET /io/ProductFinder con filtros (múltiples productos)
export const getProductsFinder = async (
  params: ProductFinderParams
): Promise<BestsellerProducts> => {
  try {
    const data = await axiosClient.get<BestsellerProducts>("ProductFinder", {
      params,
    });
    return data;
  } catch (error: unknown) {
    console.error("Error fetching products:", error);
    if (error instanceof Error) {
      throw new Error(`Error fetching products: ${error.message}`);
    } else {
      throw new Error("Error fetching products: Unknown error");
    }
  }
};

// GET /io/ProductFinder pasando bes_asin (un solo producto)
export const getProductFinderByAsin = async (
  bes_asin: string
): Promise<BestsellerProduct> => {
  try {
    const data = await axiosClient.get<BestsellerProduct>("ProductFinder", {
      params: { bes_asin },
    });
    return data;
  } catch (error: unknown) {
    console.error("Error fetching product by ASIN:", error);
    if (error instanceof Error) {
      throw new Error(`Error fetching product by ASIN: ${error.message}`);
    } else {
      throw new Error("Error fetching product by ASIN: Unknown error");
    }
  }
};

// GET /io/ProductFinder/ProductDetails
// Retorna datos de un producto con históricos, usando `BestsellerProductDetails`
export const getProductDetails = async (
  productId: string | number
): Promise<BestsellerProductDetails> => {
  try {
    const data = await axiosClient.get<BestsellerProductDetails>(
      "ProductFinder/ProductDetails",
      {
        params: { productId },
      }
    );
    return data;
  } catch (error: unknown) {
    console.error("Error fetching product details:", error);
    if (error instanceof Error) {
      throw new Error(`Error fetching product details: ${error.message}`);
    } else {
      throw new Error("Error fetching product details: Unknown error");
    }
  }
};

// GET /io/ProductFinder/Categories
export const getProductFinderCategories = async (
  includeChild = true
): Promise<Category[]> => {
  try {
    const data = await axiosClient.get<Category[]>(
      `/ProductFinder/Categories?include_child=${includeChild}`
    );
    return data.filter((category) => category.categoryId !== 0);
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);
    if (error instanceof Error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    } else {
      throw new Error("Error fetching categories: Unknown error");
    }
  }
};

// GET /io/ProductFinder/SubCategories

export const getProductFinderSubCategories = async (
  parent_categoryId: number,
  includeChild = true
): Promise<Category[]> => {
  try {
    const data = await axiosClient.get<Category[]>(
      "ProductFinder/SubCategories",
      {
        params: { include_child: includeChild, parent_categoryId },
      }
    );
    return data;
  } catch (error: unknown) {
    console.error("Error fetching subcategories:", error);
    if (error instanceof Error) {
      throw new Error(`Error fetching subcategories: ${error.message}`);
    } else {
      throw new Error("Error fetching subcategories: Unknown error");
    }
  }
};

// GET /io/ProductFinder/PriceRange
interface PriceRangeData {
  min: number;
  max: number;
}

export const getProductFinderPriceRange = async (): Promise<PriceRangeData> => {
  try {
    const data = await axiosClient.get<PriceRangeData>(
      "ProductFinder/PriceRange"
    );
    return data;
  } catch (error: unknown) {
    console.error("Error fetching price range:", error);
    if (error instanceof Error) {
      throw new Error(`Error fetching price range: ${error.message}`);
    } else {
      throw new Error("Error fetching price range: Unknown error");
    }
  }
};

// GET /io/ProductFinder/GenerateProductImage

interface GenerateProductImageData {
  imageUrl: string;
}

export const generateProductImage = async (
  productId: string | number
): Promise<GenerateProductImageData> => {
  try {
    const data = await axiosClient.get<GenerateProductImageData>(
      "ProductFinder/GenerateProductImage",
      {
        params: { productId },
      }
    );
    return data;
  } catch (error: unknown) {
    console.error("Error generating product image:", error);
    if (error instanceof Error) {
      throw new Error(`Error generating product image: ${error.message}`);
    } else {
      throw new Error("Error generating product image: Unknown error");
    }
  }
};
