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
import { usePotentialProductsFilterStore } from "../../../../store/potentialProductsFilterStore";
import imageDefault from "../../../../assets/images/default-product-image.png";
import { TrendIcon } from "../../../../components/common/TrendIcon";
import { UnifiedProduct } from "../../../../types/potentialProduct";

const PotentialProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedProduct,
    selectedProductImage,
    sourcingPlatform,
    setCategories,
    setPriceRange,
    setPriceRangeSelected,
    setIsDataLoaded,
    categorySelected,
  } = usePotentialProductsFilterStore();

  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleShowProductDetails = (product: any) => {
    console.log("Product details:", product);
    navigate("/product-finder/aliexpress-details");
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
  ]);

  // filtrar si la categoria cambia
  useEffect(() => {
    console.log("categorySelected:", categorySelected);
  }, [categorySelected]);
  useEffect(() => {
    console.log("products:", products);
  }, [products]);

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

          {/* Lista de productos encontrados */}
          <Box
            mt={2}
            width="100%"
            display="flex"
            flexWrap="wrap"
            gap="16px"
            justifyContent="center"
          >
            {products.map((product, index) => (
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
                      Price: ${product.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      DOA: $
                      {selectedProduct.bes_price && product.price
                        ? (selectedProduct.bes_price - product.price).toFixed(2)
                        : "0.00"}{" "}
                      USD
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
                        : "0.00"}{" "}
                      USD
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
            ))}
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
