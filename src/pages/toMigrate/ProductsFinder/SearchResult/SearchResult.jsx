import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Tooltip,
} from "@mui/material";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { findByImage, findByText } from "services";
import { useAtom } from "jotai";
import { bsSelectedProductAtom, aliexpressSelectedProductAtom } from "stores/productAtom";
import { ArrowUpward, ArrowDownward, HorizontalRule } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const getTrendIcon = (current, average) => {
  if (current > average) return <ArrowUpward style={{ color: "green" }} />;
  if (current < average) return <ArrowDownward style={{ color: "red" }} />;
  return <HorizontalRule style={{ color: "gray" }} />;
};

const SearchResults = () => {
  const [selectedProduct] = useAtom(bsSelectedProductAtom);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const query = params.get("query");
  const imageUrl = params.get("imageUrl");

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const [, setAliexpressSelectedProduct] = useAtom(aliexpressSelectedProductAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      const maxRetries = 3;
      let attempt = 0;
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      while (attempt < maxRetries) {
        try {
          let response;
          if (imageUrl) {
            response = await findByImage(imageUrl);
            const productData = response.data?.products?.traffic_image_product_d_t_o || [];
            setProducts(productData);
          } else if (query) {
            response = await findByText(query);
            const productData =
              response.aliexpress_ds_text_search_response?.data?.products
                ?.selection_search_product || [];
            setProducts(productData);
          }
          // Si la llamada fue exitosa, salimos del bucle
          setLoading(false);
          return;
        } catch (err) {
          attempt++;
          console.error(`Error fetching products en intento ${attempt}:`, err);
          if (attempt >= maxRetries) {
            setError(
              "Error fetching products después de varios intentos. Por favor, inténtalo más tarde."
            );
            setLoading(false);
            return;
          }
          // Esperar unos milisegundos antes de reintentar
          await delay(500); // espera 500 milisegundos (ajusta según necesites)
        }
      }
    };

    fetchProducts();
  }, [query, imageUrl]);

  const handleShowProductDetails = (product) => {
    setAliexpressSelectedProduct(product);
    navigate("/product-finder/aliexpress-details");
  };

  return (
    <DashboardLayout>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      ) : (
        selectedProduct && (
          <Box display="flex" flexDirection="column" width="100%" p={2}>
            <Paper elevation={3} style={{ padding: "16px", width: "100%" }}>
              {/* Encabezado */}
              <Card>
                <Box display="flex" gap="16px" alignItems="center">
                  <Box flexShrink={0} width="20%">
                    <img
                      src={imageUrl}
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
                    <Typography variant="h6">{selectedProduct.bes_title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Brand: {selectedProduct.bes_brand || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Current Price: $
                      {selectedProduct.bes_price ? selectedProduct.bes_price.toFixed(2) : "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Sales Rank: {selectedProduct.bes_salesrank || "N/A"}{" "}
                      {getTrendIcon(
                        selectedProduct.bes_salesrank,
                        selectedProduct.bes_salesrank90DaysAverage
                      )}
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      Bought in past month: &nbsp;
                      {selectedProduct.bes_boughtInPastMonth + "+" || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Price Trend:{" "}
                      {getTrendIcon(
                        selectedProduct.bes_price,
                        selectedProduct.bes_priceBuyBox90DaysAverage
                      )}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Competition Trend:{" "}
                      {getTrendIcon(
                        selectedProduct.bes_newOfferCount,
                        selectedProduct.bes_newOfferCount90DaysAverage
                      )}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            </Paper>

            {/* Sección de Productos */}
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
                    xs: "100%", // Ancho completo en pantallas pequeñas
                    sm: "calc(50% - 16px)", // Dos por fila en pantallas medianas, restando el `gap`
                    md: "calc(33.33% - 16px)", // Tres por fila en pantallas más grandes, restando el `gap`
                    lg: "calc(25% - 16px)", // Cuatro por fila en pantallas muy grandes, restando el `gap`
                  }}
                  mb={2}
                >
                  <Card>
                    <img
                      src={
                        product.product_main_image_url || "/assets/imgs/default-product-image.png"
                      }
                      alt={product.product_title}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "contain",
                        padding: "10px",
                      }}
                    />
                    <CardContent>
                      <Tooltip title={product.product_title}>
                        <Typography
                          variant="h6"
                          style={{
                            whiteSpace: "nowrap", // Asegura que el texto no se divida en varias líneas
                            overflow: "hidden", // Oculta el texto que no cabe en el contenedor
                            textOverflow: "ellipsis", // Añade "..." al final si el texto es demasiado largo
                          }}
                        >
                          {product.product_title}
                        </Typography>
                      </Tooltip>
                      <Tooltip title={product.second_level_category_name}>
                        <Typography
                          variant="body2"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          color="textSecondary"
                        >
                          Category: {product.second_level_category_name || "N/A"}
                        </Typography>
                      </Tooltip>
                      <Typography variant="body2" color="textSecondary">
                        Price: ${product.target_sale_price || "N/A"}{" "}
                        {product.target_sale_price_currency}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        DOA: $
                        {(selectedProduct.bes_price - product.target_sale_price).toFixed(2) || "0%"}{" "}
                        USD
                      </Typography>

                      <Typography variant="body2" color="textSecondary">
                        Potencial Profit: $
                        {(
                          (selectedProduct.bes_price - product.target_sale_price) *
                          selectedProduct.bes_boughtInPastMonth
                        ).toFixed(2) || "0%"}{" "}
                        USD
                      </Typography>

                      <Box mt={2}>
                        <MDButton
                          variant="contained"
                          fullWidth
                          color="primary"
                          onClick={() => {
                            handleShowProductDetails(product);
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Analyze Product
                        </MDButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        )
      )}
    </DashboardLayout>
  );
};

export default SearchResults;
