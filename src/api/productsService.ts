// src/api/productsService.ts
import axiosClient from "./axiosClient";

interface Product {
  id?: string | number;
  [key: string]: any;
}

// GET /io/Products
export const fetchProducts = async (filters: Record<string, any>) => {
  try {
    return await axiosClient.get("Products", { params: filters });
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};

// POST /io/Products
export const createProduct = async (product: Product) => {
  try {
    return await axiosClient.post("Products", product);
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Error creating product");
  }
};

// PUT /io/Products
export const updateProduct = async (product: Product) => {
  try {
    return await axiosClient.put("Products", product);
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Error updating product");
  }
};

// DELETE /io/Products
export const deleteProduct = async (id: string | number) => {
  try {
    return await axiosClient.delete("Products", {
      params: { id },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Error deleting product");
  }
};
