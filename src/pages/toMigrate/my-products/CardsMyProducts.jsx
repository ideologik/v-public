import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, Typography, Grid, CircularProgress, Box, Tooltip } from "@mui/material";
import MDButton from "components/MDButton";
import { fetchProducts, fetchAliExpressGetProductByID, aliExpressProductEnhancer } from "services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublishProductDialog from "../ProductsFinder/SearchResult/PublishProductDialog"; // Import the new component

const CardsMyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const [openPopup, setOpenPopup] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [suggestedPrice, setSuggestedPrice] = useState(0);

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  // Fetch products with pagination
  const fetchProductsData = async (currentPage) => {
    if (loading || !hasMore) return; // Prevenir múltiples llamadas
    setLoading(true);

    try {
      const response = await fetchProducts({ page: currentPage, total_rows: 10 });
      const newProducts = response.data || [];

      if (newProducts.length === 0) {
        setHasMore(false); // Detener el paginado si no hay más productos
      } else {
        setProducts((prevProducts) => {
          const uniqueProducts = newProducts.filter(
            (product) => !prevProducts.some((p) => p.pro_id === product.pro_id) // Evitar duplicados
          );
          return [...prevProducts, ...uniqueProducts];
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
    setLoading(false);
  };

  // Initial fetch
  useEffect(() => {
    let isMounted = true;
    setProducts([]);
    setPage(0);
    setHasMore(true); // Reiniciar la capacidad de paginado
    if (isMounted) fetchProductsData(0);
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch more products when page changes
  useEffect(() => {
    if (page > 0) fetchProductsData(page);
  }, [page]);

  // Intersection Observer for infinite scrolling
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchAdditionalProductInfo = async (product) => {
    try {
      const response = await fetchAliExpressGetProductByID(product.pro_ali_id);
      const result = response?.aliexpress_ds_product_get_response?.result;

      if (result) {
        // Extract image URLs
        const imageURLs = result.ae_multimedia_info_dto?.image_urls
          ? result.ae_multimedia_info_dto.image_urls.split(";")
          : [];

        // Extract title and description
        const productTitle = result.ae_item_base_info_dto?.subject || "";
        const productDescription = result.ae_item_base_info_dto?.detail || "";

        // Set additionalInfo with the necessary properties
        return {
          ...result,
          productTitles: [productTitle],
          productDescriptions: [productDescription],
          imageURLs,
        };
      }
    } catch (error) {
      console.error("Error fetching additional product info:", error);
    }
  };

  const fetchAdditionalInfo = async (product) => {
    setSuggestedPrice(product.pro_price);
    setLoading(true);

    const promiseAditionalInfo = fetchAdditionalProductInfo(product);
    const promiseProductEnhancer = aliExpressProductEnhancer(product.pro_ali_id);

    toast.promise(
      Promise.all([promiseProductEnhancer, promiseAditionalInfo]),
      {
        pending: "Fetching additional product information...",
        success: "Product information loaded successfully 👌",
        error: "Error fetching product information 🤯",
      },
      {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      }
    );

    try {
      const [data, aliexpressSelectedProduct] = await Promise.all([
        promiseProductEnhancer,
        promiseAditionalInfo,
      ]);

      // Ensure productTitles and productDescriptions are arrays
      const productTitles = data.productTitles || [];
      const productDescriptions = data.productDescriptions || [];

      // Use default title and description if not present
      if (productTitles.length === 0) {
        const defaultTitle = aliexpressSelectedProduct.product_title || "";
        productTitles.push(defaultTitle);
      }

      if (productDescriptions.length === 0) {
        const defaultDescription = additionalInfo?.ae_item_base_info_dto?.detail || "";
        productDescriptions.push(defaultDescription);
      }

      // Update additionalInfo with new data
      setAdditionalInfo({
        ...additionalInfo,
        ...data,
        productTitles,
        productDescriptions,
      });

      if (data) {
        setOpenPopup(true);
      }
    } catch (error) {
      console.error("Error fetching additional information:", error);
    }

    setLoading(false);
  };

  return (
    <>
      <Grid container spacing={3} p={2}>
        <ToastContainer />
        {products.length === 0 && !loading && (
          <Grid item xs={12} container justifyContent="center" alignItems="center">
            <Typography variant="h6">No products available.</Typography>
          </Grid>
        )}
        {products.map((product, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={product.pro_id}
            ref={index === products.length - 1 ? lastProductRef : null}
          >
            <Card>
              <Box
                component="img"
                src={
                  product.pro_imageURLs
                    ? product.pro_imageURLs.split(",")[0]
                    : "/assets/imgs/default-product-image.png"
                }
                alt={product.pro_name}
                sx={{ width: "100%", height: "200px", objectFit: "contain" }}
              />
              <CardContent>
                <Tooltip title={product.pro_name}>
                  <Typography variant="h6">
                    {product.pro_name.length > 40
                      ? `${product.pro_name.slice(0, 40)}...`
                      : product.pro_name}
                  </Typography>
                </Tooltip>
                <Typography variant="body2" color="textSecondary">
                  Price: {product.pro_price}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: {product.pro_status === 1 ? "Draft" : "Published"}
                </Typography>
                <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                  <MDButton
                    variant="contained"
                    fullWidth
                    color="secondary"
                    href={product.pro_url}
                    target="_blank"
                  >
                    View on AliExpress
                  </MDButton>
                </Box>
                <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                  <MDButton
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={() => {
                      fetchAdditionalInfo(product);
                    }}
                  >
                    Publish
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
      {/* Popup Dialog */}
      <PublishProductDialog
        open={openPopup}
        onClose={handleClosePopup}
        loading={loading}
        setLoading={setLoading}
        additionalInfo={additionalInfo}
        suggestedPrice={suggestedPrice}
      />
    </>
  );
};

export default CardsMyProducts;
