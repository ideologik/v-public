import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, CircularProgress, Box, Tooltip } from "@mui/material";
import MDButton from "components/MDButton";
import { shopifyGetProducts } from "services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CardShopifyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const response = await shopifyGetProducts();
      console.log("respyesta de shopify", response.data.products.edges);

      const products = response.data.products.edges.sort((a, b) => {
        // Extraemos el número del ID para compararlo como número
        const idA = parseInt(a.node.id.match(/\d+$/)[0], 10);
        const idB = parseInt(b.node.id.match(/\d+$/)[0], 10);
        return idB - idA; // Orden descendente
      });
      setProducts(products);
      toast.success("Data fetched successfully.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  return (
    <Grid container spacing={3} p={2}>
      <ToastContainer /> {/* Container for displaying toasts */}
      {products.map(({ node: product }) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Card>
            <Box
              component="img"
              src={
                product.featuredMedia?.preview?.image.url ||
                "/assets/imgs/default-product-image.png"
              }
              alt={product.title}
              sx={{ width: "100%", height: "200px", objectFit: "contain" }}
            />
            <CardContent>
              <Tooltip title={product.title}>
                <Typography variant="h6">
                  {product.title.length > 40 ? `${product.title.slice(0, 40)}...` : product.title}
                </Typography>
              </Tooltip>
              <Typography variant="body2" color="textSecondary">
                Price: ${product.priceRangeV2.minVariantPrice.amount}
              </Typography>
              <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                <MDButton
                  variant="contained"
                  fullWidth
                  color="primary"
                  href={product.onlineStorePreviewUrl}
                  target="_blank"
                >
                  View Product
                </MDButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {loading && (
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <CircularProgress size={30} />
        </Grid>
      )}
    </Grid>
  );
};

export default CardShopifyProducts;
