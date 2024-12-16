// src/pages/Dashboard/ProductFinder/PotentialProductsPage.tsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Tooltip,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { aliExpressFindByImage } from "../../../../api/aliexpressService";
import { getCjDropshippingByImage } from "../../../../api/cjDropshippingService";

import imageDefault from "../../../../assets/images/default-product-image.png";
import { TrendIcon } from "../../../../components/common/TrendIcon";
import { UnifiedProduct } from "../../../../types/potentialProduct";
import { useSelectedProductsStore } from "../../../../store/selectedProductsStore";
import { usePotentialProductsFilterStore } from "../../../../store/potentialProductsFilterStore";

const PotentialProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    sourcingPlatform,
    setCategories,
    setPriceRange,
    setPriceRangeSelected,
    setIsDataLoaded,
    categorySelected,
    priceRangeSelected,
    sortOption,
  } = usePotentialProductsFilterStore();
  const { selectedProduct, selectedProductImage } = useSelectedProductsStore();

  const [products, setProducts] = useState<UnifiedProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<UnifiedProduct[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { setSelectedProductForAnalysys } = useSelectedProductsStore();

  const handleShowProductDetails = (product: any) => {
    console.log("Product details:", product);
    setSelectedProductForAnalysys(product);
    navigate("/product-finder/analyze-product");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedProduct || !selectedProductImage) {
        return;
      }

      setLoading(true);
      setError(null);
      setIsDataLoaded(false);

      try {
        let fetchedProducts: UnifiedProduct[] = [];

        if (sourcingPlatform === "aliexpress") {
          fetchedProducts = await aliExpressFindByImage(selectedProductImage);
        } else if (sourcingPlatform === "cj") {
          fetchedProducts = await getCjDropshippingByImage(
            selectedProductImage
          );
        } else {
          const ae = await aliExpressFindByImage(selectedProductImage);
          const cj = await getCjDropshippingByImage(selectedProductImage);
          fetchedProducts = [...ae, ...cj];
        }

        // Extraer categorías únicas
        const uniqueCategories = Array.from(
          new Set(
            fetchedProducts
              .map((prod) => prod.category)
              .filter((cat: string) => cat && cat.trim() !== "")
          )
        );

        const categories = uniqueCategories.map(
          (cat: string, index: number) => ({
            categoryId: index + 1,
            category: cat,
          })
        );

        // Determinar rango de precios
        const prices = fetchedProducts.map((p: any) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange: [number, number] = [
          isFinite(minPrice) ? minPrice : 0,
          isFinite(maxPrice) ? maxPrice : 100,
        ];

        setCategories(categories);
        setPriceRange(priceRange);
        setPriceRangeSelected(priceRange);

        setProducts(fetchedProducts);
        setIsDataLoaded(true);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error fetching products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    selectedProduct,
    selectedProductImage,
    sourcingPlatform,
    setCategories,
    setPriceRange,
    setPriceRangeSelected,
    setIsDataLoaded,
    setProducts,
  ]);

  useEffect(() => {
    console.log("sortOption:", sortOption);
    let result = [...products];

    // Filtrar por categoría
    if (categorySelected && categorySelected !== "all") {
      result = result.filter((p) => p.category === categorySelected);
    }

    // Filtrar por rango de precios
    result = result.filter(
      (p) =>
        p.price >= priceRangeSelected[0] && p.price <= priceRangeSelected[1]
    );
    result = result.map((product) => ({
      ...product,
      doa:
        selectedProduct && selectedProduct.bes_price && product.price
          ? selectedProduct.bes_price - product.price
          : 0,
    }));

    // Ordenar según sortOption
    switch (sortOption) {
      case "1":
        // ordenar por precio ascendente
        result.sort((a, b) => a.price - b.price);
        break;
      case "2":
        // ordenar por precio descendente
        result.sort((a, b) => b.price - a.price);
        break;
      case "3":
        // ordenar por doa ascendente
        result.sort((a, b) => (a as any).doa - (b as any).doa);
        break;
      case "4":
        // ordenar por doa descendente
        result.sort((a, b) => (b as any).doa - (a as any).doa);
        break;

      default:
        // sortOption = 0 sin orden específico
        break;
    }

    setFilteredProducts(result);
  }, [
    products,
    categorySelected,
    priceRangeSelected,
    sortOption,
    setFilteredProducts,
    selectedProduct,
  ]);

  return (
    <>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      ) : selectedProduct ? (
        <Box p={1} width="100%">
          {/* Card del producto seleccionado */}
          <Box>
            <Card>
              <Box
                display="flex"
                gap="16px"
                alignItems="center"
                p={1}
                minWidth={0}
              >
                <Box flexShrink={0} width="20%">
                  <img
                    src={selectedProductImage || imageDefault}
                    alt={`${selectedProduct.bes_title}`}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "contain",
                      cursor: "pointer",
                    }}
                  />
                </Box>
                <CardContent sx={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                  <Tooltip title={selectedProduct.bes_title}>
                    <Typography
                      variant="h6"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        mb: 1,
                        display: "block",
                        maxWidth: "100%",
                        cursor: "pointer",
                      }}
                    >
                      {selectedProduct.bes_title}
                    </Typography>
                  </Tooltip>
                  <Typography variant="body2" color="textSecondary">
                    Brand: {selectedProduct.bes_brand || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Current Price: $
                    {selectedProduct.bes_price
                      ? selectedProduct.bes_price.toFixed(2)
                      : "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Sales Rank: {selectedProduct.bes_salesrank || "N/A"}
                    <TrendIcon
                      current={selectedProduct.bes_salesrank ?? 0}
                      average={selectedProduct.bes_salesrank90DaysAverage ?? 0}
                    />
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Bought in past month: &nbsp;
                    {selectedProduct.bes_boughtInPastMonth
                      ? selectedProduct.bes_boughtInPastMonth + "+"
                      : "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Price Trend:
                    <TrendIcon
                      current={selectedProduct.bes_price ?? 0}
                      average={
                        selectedProduct.bes_priceBuyBox90DaysAverage ?? 0
                      }
                    />
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Competition Trend:
                    <TrendIcon
                      current={selectedProduct.bes_newOfferCount ?? 0}
                      average={
                        selectedProduct.bes_newOfferCount90DaysAverage ?? 0
                      }
                    />
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" color="textSecondary">
              Similar Products
            </Typography>
          </Box>
          {/* Lista de productos similares */}
          <Box
            mt={2}
            width="100%"
            display="flex"
            flexWrap="wrap"
            gap="16px"
            justifyContent="center"
          >
            {filteredProducts.map((product, index) => {
              const doa =
                selectedProduct.bes_price && product.price
                  ? selectedProduct.bes_price - product.price
                  : 0;
              return (
                <Box
                  key={index}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 16px)",
                      md: "calc(33.33% - 16px)",
                      lg: "calc(25% - 16px)",
                    },
                  }}
                  mb={2}
                >
                  <Card>
                    <img
                      src={product.image || imageDefault}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "contain",
                        padding: "10px",
                      }}
                    />
                    <CardContent>
                      <Tooltip title={product.name}>
                        <Typography
                          variant="h6"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            cursor: "pointer",
                          }}
                        >
                          {product.name}
                        </Typography>
                      </Tooltip>
                      <Tooltip title={product.category}>
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          color="textSecondary"
                        >
                          Category: {product.category || "N/A"}
                        </Typography>
                      </Tooltip>
                      <Typography variant="body2" color="textSecondary">
                        Platform: {product.platform}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Price: ${product.price.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        DOA: ${doa.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Potential Profit: $
                        {selectedProduct.bes_price &&
                        product.price &&
                        selectedProduct.bes_boughtInPastMonth
                          ? (
                              (selectedProduct.bes_price - product.price) *
                              selectedProduct.bes_boughtInPastMonth
                            ).toFixed(2)
                          : "0.00"}
                      </Typography>

                      <Box mt={2}>
                        <Button
                          variant="contained"
                          fullWidth
                          color="primary"
                          onClick={() => {
                            handleShowProductDetails(product);
                          }}
                          rel="noopener noreferrer"
                        >
                          Analyze Product
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Typography>No selected product.</Typography>
        </Box>
      )}
    </>
  );
};

export default PotentialProductsPage;
