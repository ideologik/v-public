// src/pages/Dashboard/ProductFinder/ProductFinderPage.tsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
} from "@mui/material";
import { useProductFinderFilterStore } from "../../../store/productFinderFilterStore";
import { getProductsFinder } from "../../../api/productFinderService";
import {
  BestsellerProduct,
  ProductFinderParams,
} from "../../../types/productFinder"; // Asegúrate de importar los tipos correctos

export const ProductFinderPage: React.FC = () => {
  const [products, setProducts] = useState<BestsellerProduct[]>([]);

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

      const params: ProductFinderParams = {
        searchText: searchText || "",
        AmazonCategoryId: categoryId || undefined,
        AmazonSubCategoryId: subCategoryId || undefined,
        AmazonThirdCategoryId: thirdLevelCategoryId || undefined,
        priceFrom: priceRangeSelected[0],
        priceTo: priceRangeSelected[1],
        sort_by: parseInt(sortOption),
      };

      try {
        // getProductsFinder retorna BestsellerProducts { total_records, data: [...] }
        const data = await getProductsFinder(params);
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
    <Box p={2}>
      {products.length === 0 ? (
        <Typography variant="body1">No products found</Typography>
      ) : (
        <Grid container spacing={3} p={1}>
          {products.map((product, index) => {
            const name = product.bes_title || "No Name";
            const price =
              product.bes_price !== null ? product.bes_price.toFixed(2) : "N/A";
            const brand = product.bes_brand || "N/A";
            const soldLastMonth =
              product.bes_boughtInPastMonth !== null
                ? product.bes_boughtInPastMonth + "+"
                : "N/A";

            let imageURL = "/assets/imgs/default-product-image.png";
            if (product.bes_imageURLs) {
              const imageArray = product.bes_imageURLs
                .split(",")
                .map((url) => url.trim());
              if (imageArray.length > 0) {
                imageURL = imageArray[0];
              }
            }

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={product.bes_id || index}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Imagen del producto */}
                  <CardMedia
                    component="img"
                    image={imageURL}
                    alt={name}
                    sx={{ height: 200, objectFit: "contain" }}
                  />
                  <CardContent
                    sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        mb: 1,
                      }}
                    >
                      {name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Brand: {brand}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Price: ${price}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Sold last month: {soldLastMonth}
                    </Typography>

                    {/* Botones (sin funcionalidad por ahora) */}
                    <Box mt={2} display="flex" flexDirection="column" gap={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled
                      >
                        Find potential products
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        disabled
                      >
                        Publish to Store
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};
