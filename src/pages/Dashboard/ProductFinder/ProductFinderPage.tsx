// src/pages/Dashboard/ProductFinder/ProductFinderPage.tsx
import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useProductFinderFilterStore } from "../../../store/productFinderFilterStore";

// Imagina que tienes un servicio real que llama a la API:
import { getProductsFinder } from "../../../api/productFinderService";

export const ProductFinderPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  const {
    searchText,
    categoryId,
    subCategoryId,
    thirdLevelCategoryId,
    priceRangeSelected,
    sortOption,
    isCategoriesLoaded,
  } = useProductFinderFilterStore();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isCategoriesLoaded) return;

      // Llama a la API con los filtros actuales
      const params = {
        // Ajusta estos nombres según los requerimientos de tu API
        searchText: searchText || "",
        AmazonCategoryId: categoryId || undefined,
        AmazonSubCategoryId: subCategoryId || undefined,
        AmazonThirdCategoryId: thirdLevelCategoryId || undefined,
        priceFrom: priceRangeSelected[0],
        priceTo: priceRangeSelected[1],
        sort_by: sortOption, // Ajusta el tipo según tu API
      };

      try {
        // getProductsFinder podría devolver un objeto { total_records, data: [...] }
        const data = await getProductsFinder(params);
        // Asumiendo que data.data es el array de productos
        setProducts(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [
    searchText,
    categoryId,
    subCategoryId,
    thirdLevelCategoryId,
    priceRangeSelected,
    sortOption,
    isCategoriesLoaded,
  ]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Product Finder
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {products.length === 0 ? (
          <Typography variant="body1">No products found</Typography>
        ) : (
          products.map((product) => (
            <Paper key={product.id} sx={{ p: 2, width: 200 }}>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2">Price: {product.price}</Typography>
              <Typography variant="body2">
                Sold last month: {product.soldLastMonth}
              </Typography>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};
