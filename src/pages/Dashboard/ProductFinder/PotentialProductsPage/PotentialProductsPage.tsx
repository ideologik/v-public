// src/pages/Dashboard/ProductFinder/PotentialProductsPage.tsx
import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { aliExpressFindByImage } from "../../../../api/aliexpressService";
import { getCjDropshippingByImage } from "../../../../api/cjDropshippingService";
import PotentialProductsFilters from "../../../../components/layout/FilterMenu/PotentialProductsFilters";
import { usePotentialProductsFilterStore } from "../../../../store/potentialProductsFilterStore";

export const PotentialProductsPage: React.FC = () => {
  const {
    selectedProduct,
    selectedProductImage,
    sourcingPlatform,
    setCategories,
    setSubCategories,
    setPriceRange,
    setPriceRangeSelected,
    setIsDataLoaded,
    categories,
    subCategories,
  } = usePotentialProductsFilterStore();

  useEffect(() => {
    const loadData = async () => {
      if (!selectedProduct || !selectedProductImage) {
        return;
      }
      setIsDataLoaded(false);

      let products: any[] = [];
      if (sourcingPlatform === "aliexpress") {
        products = await aliExpressFindByImage(selectedProductImage);
      } else if (sourcingPlatform === "cj") {
        products = await getCjDropshippingByImage(selectedProductImage);
      } else {
        // all: Podrías combinar ambos resultados si así lo deseas
        const aeProducts = await aliExpressFindByImage(selectedProductImage);
        const cjProducts = await getCjDropshippingByImage(selectedProductImage);
        products = [...aeProducts, ...cjProducts];
      }

      // Ahora extraemos las categorías, subcategorías y rango de precios del array de products
      // Supongamos que products ya están unificados en la interfaz UnifiedProduct con "category", "subcategory" y "price"
      const uniqueCategories = Array.from(
        new Set(products.map((p) => p.category))
      ).map((c, idx) => ({
        categoryId: idx + 1,
        category: c,
      }));

      // Subcategorías, si lo deseas, puedes filtrarlas
      const uniqueSubCategories = Array.from(
        new Set(products.map((p) => p.subcategory).filter(Boolean))
      ).map((sc, idx) => ({
        categoryId: idx + 100,
        category: sc,
      }));

      // Precio mínimo y máximo
      const prices = products.map((p) => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      setCategories(uniqueCategories);
      setSubCategories(uniqueSubCategories);
      setPriceRange([minPrice, maxPrice]);
      setPriceRangeSelected([minPrice, maxPrice]);

      setIsDataLoaded(true);
    };

    loadData();
  }, [
    selectedProduct,
    selectedProductImage,
    sourcingPlatform,
    setCategories,
    setSubCategories,
    setPriceRange,
    setPriceRangeSelected,
    setIsDataLoaded,
  ]);

  return (
    <Box p={2}>
      <Typography variant="h5">Potential Products</Typography>
      {selectedProduct ? (
        <>
          <Typography variant="body1">
            Mostrando resultados basados en el producto seleccionado:{" "}
            {selectedProduct.bes_title}
          </Typography>
          <PotentialProductsFilters />
          {/* Aquí podrías mostrar los productos filtrados del lado del cliente */}
        </>
      ) : (
        <Typography variant="body1">No hay producto seleccionado.</Typography>
      )}
    </Box>
  );
};
