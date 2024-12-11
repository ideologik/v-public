import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography, Grid, CircularProgress, Box, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import Slider from "react-slick";
import MDSnackbar from "components/MDSnackbar";
import { productsFinder } from "services";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./cardProductsStyle.css";
import MDButton from "components/MDButton";
import { ArrowUpward, ArrowDownward, HorizontalRule } from "@mui/icons-material";
import { useAtom } from "jotai";
import { bsSelectedProductAtom } from "stores/productAtom";
import { shopifyCreateProduct } from "services";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getTrendIcon = (current, average) => {
  if (current > average) return <ArrowUpward style={{ color: "green" }} />;
  if (current < average) return <ArrowDownward style={{ color: "red" }} />;
  return <HorizontalRule style={{ color: "gray" }} />;
};

const CardProducts = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertProps, setAlertProps] = useState({
    open: false,
    message: "",
    color: "info",
    dismissible: false,
  });
  const [page, setPage] = useState(0);
  const observerRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const navigate = useNavigate();
  const [_, setBsSelectedProduct] = useAtom(bsSelectedProductAtom);

  const fetchProductsData = async (currentPage, showLoading = false) => {
    if (Object.keys(filters).length === 0 || filters.AmazonCategoryId === null) {
      setProducts([]);
      return;
    }

    if (showLoading) setLoading(true);
    try {
      console.log("filters in cardsproducts", filters);
      if (filters.AmazonSubCategoryId === "all") filters.AmazonSubCategoryId = null;
      const response = await productsFinder({
        ...filters,
        page: currentPage,
        total_rows: 10,
      });
      const data = response.data ? response.data : [];
      setProducts((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Error fetching products:", error);
      setAlertProps({
        open: true,
        message: "Error loading products",
        color: "error",
      });
    }
    if (showLoading) setLoading(false);
  };

  useEffect(() => {
    setProducts([]);
    setPage(0);
    fetchProductsData(0, true);
  }, [filters]);

  useEffect(() => {
    if (page > 0) fetchProductsData(page);
  }, [page]);

  const lastProductRef = useCallback(
    (node) => {
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

  const handleSearchAliExpress = (type, title, imageUrl, product) => {
    setBsSelectedProduct(product);
    // Redirige a otra ruta con los parámetros adecuados
    if (type === "text") {
      navigate(`/product-finder/search?query=${encodeURIComponent(title)}`); // Navega usando el texto
    } else if (type === "image") {
      navigate(`/product-finder/search?imageUrl=${encodeURIComponent(imageUrl)}`); // Navega usando la URL de la imagen
    }
  };

  const getImagesArray = (imageURLs) => {
    if (!imageURLs) return ["/assets/imgs/default-product-image.png"];
    return imageURLs.split(",").map((url) => url.trim());
  };

  const handleImageChange = (index, productId) => {
    setCurrentImageIndex((prevState) => ({
      ...prevState,
      [productId]: index,
    }));
  };
  const [publishingProductId, setPublishingProductId] = useState(null);

  const handlePublishProduct = async (product) => {
    if (product) {
      setPublishingProductId(product.bes_id); // Marca el producto que se está publicando

      const selectedTitleText = product.bes_title;
      const selectedDescriptionText = product.bes_amazonTitle;
      const selectedImagesUrls = product.bes_imageURLs.split(",").map((url) => url.trim());
      console.log("best product", product, product.bes_price);

      try {
        const response = await toast.promise(
          shopifyCreateProduct({
            title: selectedTitleText,
            descriptionHTML: selectedDescriptionText,
            price: product.bes_price,
            imageURLs: selectedImagesUrls.join(","),
          }),
          {
            pending: "Publishing product...",
            success: "Product published successfully 👌",
            error: "Error publishing product 🤯",
          },
          {
            position: "top-center",
            autoClose: 1500, // Puedes ajustar el tiempo de cierre automático
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          }
        );

        console.log("Product created:", response);
      } catch (error) {
        console.error("Error publishing product:", error);
      } finally {
        setPublishingProductId(null); // Resetea el estado de publicación
      }
    }
  };

  return (
    <Grid container spacing={3} p={2}>
      {products.map((product, index) => {
        const images = getImagesArray(product.bes_imageURLs);
        const currentIndex = currentImageIndex[product.bes_id] || 0;
        const isSingleImage = images.length === 1;

        // Configurar opciones de react-slick
        const sliderSettings = {
          dots: false,

          infinite: !isSingleImage,
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          adaptiveHeight: true,
          afterChange: (current) => handleImageChange(current, product.bes_id),
        };

        return (
          <>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={index}
              ref={index === products.length - 1 ? lastProductRef : null}
            >
              <Card
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    height: "30vh",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Slider
                    {...sliderSettings}
                    style={{
                      width: "100%",
                      height: "100%",
                      cursor: "grab",
                    }}
                  >
                    {images.map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="slick-slide"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        <img
                          src={image}
                          alt={`${product.bes_title} - ${imgIndex}`}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
                <CardContent style={{ padding: "1rem", flex: 1 }}>
                  <Tooltip title={product.bes_title}>
                    <Typography
                      variant="h6"
                      style={{
                        whiteSpace: "nowrap", // Asegura que el texto no se divida en varias líneas
                        overflow: "hidden", // Oculta el texto que no cabe en el contenedor
                        textOverflow: "ellipsis", // Añade "..." al final si el texto es demasiado largo
                      }}
                    >
                      {product.bes_title}
                    </Typography>
                  </Tooltip>
                  <Typography variant="body2" color="textSecondary">
                    Brand: {product.bes_brand || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Current Price: ${product.bes_price ? product.bes_price.toFixed(2) : "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Sales Rank: {product.bes_salesrank || "N/A"}{" "}
                    {getTrendIcon(product.bes_salesrank, product.bes_salesrank90DaysAverage)}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Bought in past month: &nbsp;
                    {product.bes_boughtInPastMonth + "+" || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Price Trend:{" "}
                    {getTrendIcon(product.bes_price, product.bes_priceBuyBox90DaysAverage)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Competition Trend:{" "}
                    {getTrendIcon(
                      product.bes_newOfferCount,
                      product.bes_newOfferCount90DaysAverage
                    )}
                  </Typography>
                  <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                    <MDButton
                      variant="contained"
                      fullWidth
                      color="primary"
                      onClick={() =>
                        handleSearchAliExpress(
                          "image",
                          product.bes_title,
                          images[currentIndex],
                          product
                        )
                      }
                    >
                      Find potential products
                    </MDButton>
                  </Box>
                  <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                    <MDButton
                      variant="contained"
                      fullWidth
                      color="secondary"
                      onClick={() => handlePublishProduct(product)}
                      disabled={publishingProductId === product.bes_id} // Deshabilita el botón si este producto está en proceso
                    >
                      {publishingProductId === product.bes_id ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Publish to Store"
                      )}
                    </MDButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        );
      })}
      {loading && (
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <CircularProgress size={30} />
        </Grid>
      )}
      <ToastContainer />
      <MDSnackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        color={alertProps.color}
        icon="notifications"
        title="Notification"
        content={alertProps.message}
        open={alertProps.open}
        close={() => setAlertProps((prev) => ({ ...prev, open: false }))}
        autoHideDuration={1000}
      />
    </Grid>
  );
};

CardProducts.propTypes = {
  filters: PropTypes.shape({
    AmazonCategoryId: PropTypes.string,
    AmazonSubCategoryId: PropTypes.string,
  }),
};

export default CardProducts;
