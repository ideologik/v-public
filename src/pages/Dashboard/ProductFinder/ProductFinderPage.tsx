import React, { useEffect, useState, useRef, useCallback } from "react";
import { Typography, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useProductFinderFilterStore } from "../../../store/productFinderFilterStore";
import { getProductsFinder } from "../../../api/productFinderService";
import {
  BestsellerProduct,
  ProductFinderParams,
} from "../../../types/productFinder";
import { ProductCard } from "./ProductCard"; // Importamos el nuevo componente

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

  // Debounce para filtros: Esperar un tiempo antes de llamar a loadProducts cuando cambien los filtros
  useEffect(() => {
    setPage(0);
    setProducts([]);

    const debounceTimer = setTimeout(() => {
      if (isCategoriesLoaded) {
        loadProducts(0, false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
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
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading]
  );

  return (
    <>
      {products.length === 0 && !loading ? (
        <Typography variant="body1">No products found</Typography>
      ) : (
        <Grid container spacing={1} p={1}>
          {products.map((product, index) => {
            const isLastProduct = index === products.length - 1;

            return (
              <Grid
                container
                size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
                key={product.bes_id || index}
              >
                <ProductCard
                  product={product}
                  refProp={isLastProduct ? lastProductRef : undefined}
                />
              </Grid>
            );
          })}

          {loading && (
            <Grid display="flex" justifyContent="center" alignItems="center">
              <CircularProgress size={30} />
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
};
