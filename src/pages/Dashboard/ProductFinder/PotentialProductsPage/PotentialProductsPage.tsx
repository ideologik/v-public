// src/pages/Dashboard/ProductFinder/PotentialProductsPage.tsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Paper,
  Tooltip,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { aliExpressFindByImage } from "../../../../api/aliexpressService";
import { getCjDropshippingByImage } from "../../../../api/cjDropshippingService";
import { usePotentialProductsFilterStore } from "../../../../store/potentialProductsFilterStore";
import imageDefault from "../../../../assets/images/default-product-image.png";
import { TrendIcon } from "../../../../components/common/TrendIcon";

const PotentialProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedProduct,
    selectedProductImage,
    sourcingPlatform,
    setCategories,
    setSubCategories,
    setPriceRange,
    setPriceRangeSelected,
    setIsDataLoaded,
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
        let fetchedProducts: any[] = [];

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

        // Extraer categorías únicas de los productos
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

        // Extraer subcategorías únicas
        const uniqueSubCategories = Array.from(
          new Set(
            fetchedProducts
              .map((prod) => prod.subcategory)
              .filter((sub: string | undefined) => sub && sub.trim() !== "")
          )
        );

        const subCategories = uniqueSubCategories.map(
          (sub: string, index: number) => ({
            categoryId: 100 + index + 1,
            category: sub,
          })
        );

        // Determinar rango de precios a partir de los productos, por ejemplo:
        const prices = fetchedProducts.map((p: any) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange: [number, number] = [
          isFinite(minPrice) ? minPrice : 0,
          isFinite(maxPrice) ? maxPrice : 100,
        ];

        setCategories(categories);
        setSubCategories(subCategories);
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
    setSubCategories,
    setPriceRange,
    setPriceRangeSelected,
    setIsDataLoaded,
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
        <Box display="flex" flexDirection="column" width="100%" p={1}>
          <Card>
            <Box display="flex" gap="16px" alignItems="center">
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
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    mb: 1,
                  }}
                >
                  {selectedProduct.bes_title}
                </Typography>
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
                <Typography variant="h6" color="textSecondary">
                  Bought in past month: &nbsp;
                  {selectedProduct.bes_boughtInPastMonth
                    ? selectedProduct.bes_boughtInPastMonth + "+"
                    : "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Price Trend:
                  <TrendIcon
                    current={selectedProduct.bes_price ?? 0}
                    average={selectedProduct.bes_priceBuyBox90DaysAverage ?? 0}
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

          {/* Aqui NO se renderiza PotentialProductsFilters, el layout lo hace */}
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
                width={{
                  xs: "100%",
                  sm: "calc(50% - 16px)",
                  md: "calc(33.33% - 16px)",
                  lg: "calc(25% - 16px)",
                }}
                mb={2}
              >
                <Card>
                  <img
                    src={
                      product.image || "/assets/imgs/default-product-image.png"
                    }
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
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {product.name}
                      </Typography>
                    </Tooltip>
                    <Tooltip title={product.category}>
                      <Typography
                        variant="body2"
                        style={{
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
                      {/* Ejemplo: si selectedProduct.bes_price es Amazon Price y product.price es AE/CJ Price */}
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
