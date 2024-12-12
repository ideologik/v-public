// src/pages/Dashboard/ProductFinder/ProductFinderPage.tsx

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useProductFinderFilterStore } from "../../../store/productFinderFilterStore";
import { getProductsFinder } from "../../../api/productFinderService";
import {
  BestsellerProduct,
  ProductFinderParams,
} from "../../../types/productFinder";

export const ProductFinderPage: React.FC = () => {
  const [products, setProducts] = useState<BestsellerProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    searchText,
    categoryId,
    subCategoryId,
    thirdLevelCategoryId,
    priceRangeSelected,
    sortOption,
    isCategoriesLoaded,
  } = useProductFinderFilterStore();

  const loadProducts = useCallback(
    async (currentPage: number, append = false) => {
      console.log("entro a loadProducts");
      if (!isCategoriesLoaded) return;

      const params: ProductFinderParams = {
        searchText: searchText || "",
        AmazonCategoryId: categoryId || undefined,
        AmazonSubCategoryId: subCategoryId || undefined,
        AmazonThirdCategoryId: thirdLevelCategoryId || undefined,
        priceFrom: priceRangeSelected[0],
        priceTo: priceRangeSelected[1],
        sort_by: Number(sortOption),
        page: currentPage,
        total_rows: 10,
      };

      setLoading(true);
      try {
        const data = await getProductsFinder(params);
        const newProducts = data.data || [];
        setProducts((prev) =>
          append ? [...prev, ...newProducts] : newProducts
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      isCategoriesLoaded,
      searchText,
      categoryId,
      subCategoryId,
      thirdLevelCategoryId,
      priceRangeSelected,
      sortOption,
    ]
  );

  // Cargar productos cuando cambian los filtros (reiniciar lista y página)
  useEffect(() => {
    setPage(0);
    setProducts([]);
    if (isCategoriesLoaded) {
      loadProducts(0, false);
    }
  }, [
    searchText,
    categoryId,
    subCategoryId,
    thirdLevelCategoryId,
    priceRangeSelected,
    sortOption,
    isCategoriesLoaded,
    loadProducts,
  ]);

  // Cuando la página cambia (scroll infinito), cargar más productos
  useEffect(() => {
    if (page > 0) {
      loadProducts(page, true);
    }
  }, [page, loadProducts]);

  // Callback para el IntersectionObserver
  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // Cuando el último producto es visible, incrementa la página para cargar más
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading]
  );

  return (
    <Box p={2}>
      {products.length === 0 && !loading ? (
        <Typography variant="body1">No products found</Typography>
      ) : (
        <Grid container spacing={3} p={2}>
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

            // Si es el último producto, agregamos el ref para el infinite scroll
            const isLastProduct = index === products.length - 1;

            return (
              <Grid
                container
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                key={product.bes_id || index}
                ref={isLastProduct ? lastProductRef : null}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
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

          {/* Mostrar el CircularProgress si se está cargando */}
          {loading && (
            <Grid display="flex" justifyContent="center" alignItems="center">
              <CircularProgress size={30} />
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};
