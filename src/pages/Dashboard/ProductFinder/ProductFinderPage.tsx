// src/pages/Dashboard/ProductFinder/ProductFinderPage.tsx
import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useProductFinderFilterStore } from "../../../store/productFinderFilterStore";

// import { getProducts } from "../../../../api/productFinderService"; // Ajustar según tu API real

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

      // const data = await getProducts({
      //   searchText,
      //   AmazonCategoryId: categoryId,
      //   AmazonSubCategoryId: subCategoryId,
      //   AmazonThirdCategoryId: thirdLevelCategoryId,
      //   priceFrom: priceRangeSelected[0],
      //   priceTo: priceRangeSelected[1],
      //   sort_by: sortOption,
      // });
      const data: any[] = [];
      setProducts(data);
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
        {products.map((product) => (
          <Paper key={product.id} sx={{ p: 2, width: 200 }}>
            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="body2">Price: {product.price}</Typography>
            <Typography variant="body2">
              Sold last month: {product.soldLastMonth}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};
