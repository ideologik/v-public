import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import Slider from "@material-ui/core/Slider";
import { Bar, Line } from "react-chartjs-2";
import { useAtom } from "jotai";
import { useState } from "react";
import { bsSelectedProductAtom, aliexpressSelectedProductAtom } from "stores/productAtom";
import { ArrowUpward, ArrowDownward, HorizontalRule } from "@mui/icons-material";
import { aliExpressProductEnhancer, shopifyCreateProduct } from "services";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Register chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getTrendIcon = (current, average) => {
  if (current > average) return <ArrowUpward style={{ color: "green" }} />;
  if (current < average) return <ArrowDownward style={{ color: "red" }} />;
  return <HorizontalRule style={{ color: "gray" }} />;
};

const AliexpressDetail = () => {
  const [aliexpressSelectedProduct] = useAtom(aliexpressSelectedProductAtom);
  const [selectedProduct] = useAtom(bsSelectedProductAtom);
  const [suggestedPrice, setSuggestedPrice] = useState(selectedProduct.bes_price || 0);
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]); // selección múltiple de imágenes
  const [selectedTitle, setSelectedTitle] = useState(null); // selección única de título
  const [selectedDescription, setSelectedDescription] = useState(null); // selección única de descripción
  const [editingTitleIndex, setEditingTitleIndex] = useState(null); // índice del título en edición
  const [editingDescriptionIndex, setEditingDescriptionIndex] = useState(null); // índice de descripción en edición
  console.log("detalles de producto seleccionado", aliexpressSelectedProduct);

  const fetchAdditionalInfo = async () => {
    setLoading(true);

    const fetchPromise = aliExpressProductEnhancer(aliexpressSelectedProduct.product_id);

    toast.promise(
      fetchPromise,
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
      const data = await fetchPromise;
      setAdditionalInfo(data);
      if (data) {
        //seleccionar todaslas imagenes
        setSelectedImages([...Array(data.imageURLs.length).keys()]);
        setSelectedTitle(null);
        setSelectedDescription(null);
        setOpenPopup(true);
      }
    } catch (error) {
      console.error("Error al obtener la información adicional:", error);
    }

    setLoading(false);
  };

  // Manejar selección de imagen
  const handleImageToggle = (index) => {
    setSelectedImages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Manejar selección única de título
  const handleTitleSelect = (index) => {
    setSelectedTitle(index);
  };

  // Manejar selección única de descripción
  const handleDescriptionSelect = (index) => {
    setSelectedDescription(index);
  };

  // Activar modo de edición para títulos y descripciones
  const handleTitleDoubleClick = (index) => {
    setEditingTitleIndex(index);
  };

  const handleDescriptionDoubleClick = (index) => {
    setEditingDescriptionIndex(index);
  };

  // Funciones para actualizar el contenido mientras se edita
  const handleTitleChange = (event, index) => {
    const newTitles = [...additionalInfo.productTitles];
    newTitles[index] = event.target.value;
    setAdditionalInfo((prev) => ({
      ...prev,
      productTitles: newTitles,
    }));
  };

  const handleDescriptionChange = (event, index) => {
    const newDescriptions = [...additionalInfo.productDescriptions];
    newDescriptions[index] = event.target.value;
    setAdditionalInfo((prev) => ({
      ...prev,
      productDescriptions: newDescriptions,
    }));
  };

  // Función para finalizar la edición
  const handleEditComplete = () => {
    setEditingTitleIndex(null);
    setEditingDescriptionIndex(null);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  const handlePublishProduct = async () => {
    if (selectedImages.length > 0 && selectedTitle !== null && selectedDescription !== null) {
      setLoading(true);
      const selectedTitleText = additionalInfo.productTitles[selectedTitle];
      const selectedDescriptionText = additionalInfo.productDescriptions[selectedDescription];
      const selectedImagesUrls = selectedImages.map((index) => additionalInfo.imageURLs[index]);
      setOpenPopup(false);

      // Creación de la promesa para la publicación del producto
      const publishPromise = shopifyCreateProduct({
        title: selectedTitleText,
        descriptionHTML: selectedDescriptionText,
        price: suggestedPrice,
        imageURLs: selectedImagesUrls.join(","),
      });

      // Usar toast.promise para manejar el estado del toast
      toast.promise(
        publishPromise,
        {
          pending: "Publishing product...",
          success: "Product published successfully 👌",
          error: "Error publishing product 🤯",
        },
        {
          position: "top-center",
          autoClose: 3000, // Cierra automáticamente el toast después de 5 segundos
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        }
      );

      try {
        const response = await publishPromise;
        console.log("Product created:", response);
      } catch (error) {
        console.error("Error publishing product:", error);
      }

      setLoading(false);
    }
  };

  // Deshabilitar el botón si no hay al menos una imagen, un título y una descripción seleccionada
  const isPublishDisabled =
    selectedImages.length === 0 || selectedTitle === null || selectedDescription === null;
  const calculatePotentialProfit = () => {
    const profitPerUnit = suggestedPrice - parseFloat(aliexpressSelectedProduct.target_sale_price);
    return (profitPerUnit * selectedProduct.bes_boughtInPastMonth).toFixed(2);
  };

  // Data for the bar chart for price comparison
  const priceComparisonData = {
    labels: ["Amazon", "AliExpress", "Suggested Price"],
    datasets: [
      {
        label: "Price in USD",
        data: [
          selectedProduct.bes_price,
          parseFloat(aliexpressSelectedProduct.target_sale_price),
          suggestedPrice,
        ],
        backgroundColor: ["#3A75C4", "#FF6384", "#4BC0C0"],
      },
    ],
  };

  // Data for the area/bar chart for profit margin
  const profitMarginData = {
    labels: ["Profit Margin"],
    datasets: [
      {
        label: "Absolute Profit (USD)",
        data: [suggestedPrice - parseFloat(aliexpressSelectedProduct.target_sale_price)],
        backgroundColor: "#36A2EB",
      },
      {
        label: "Profit Percentage",
        data: [
          (
            ((suggestedPrice - parseFloat(aliexpressSelectedProduct.target_sale_price)) /
              parseFloat(aliexpressSelectedProduct.target_sale_price)) *
            100
          ).toFixed(2),
        ],
        backgroundColor: "#FFCE56",
      },
    ],
  };

  // Data for the line chart for trends
  const trendData = {
    labels: ["90-Day Average", "Current"],
    datasets: [
      {
        label: "Amazon Price Trend",
        data: [selectedProduct.bes_priceBuyBox90DaysAverage, selectedProduct.bes_price],
        borderColor: "#FF6384",
        fill: false,
      },
      {
        label: "Number of Sellers",
        data: [selectedProduct.bes_newOfferCount90DaysAverage, selectedProduct.bes_newOfferCount],
        borderColor: "#36A2EB",
        fill: false,
      },
    ],
  };

  return (
    <DashboardLayout>
      <MDBox display="flex" justifyContent="center" bgcolor="inherit" padding={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            {/* First Card (Summary and Controls) */}
            <Paper elevation={4} sx={{ padding: 4, borderRadius: 2 }}>
              <Card
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MDBox
                  sx={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                    borderRadius: 2,
                    mb: 1,
                    mt: 2,
                  }}
                >
                  <MDBox
                    component="img"
                    src={
                      aliexpressSelectedProduct.product_main_image_url ||
                      "/assets/imgs/default-product-image.png"
                    }
                    alt={aliexpressSelectedProduct.product_title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain", // Asegura que la imagen se vea completa sin recortes
                    }}
                  />
                </MDBox>
                <CardContent sx={{ padding: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {aliexpressSelectedProduct.product_title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Category: {aliexpressSelectedProduct.second_level_category_name || "N/A"}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Price: ${aliexpressSelectedProduct.target_sale_price || "N/A"}{" "}
                    {aliexpressSelectedProduct.target_sale_price_currency}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Current Price on Amazon: $
                    {selectedProduct.bes_price
                      ? selectedProduct.bes_price.toFixed(2) + " USD"
                      : "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Potential Profit (monthly): ${calculatePotentialProfit()} USD
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Sales Rank: {selectedProduct.bes_salesrank || "N/A"}{" "}
                    {getTrendIcon(
                      selectedProduct.bes_salesrank,
                      selectedProduct.bes_salesrank90DaysAverage
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Sale Rank last 90 days: {selectedProduct.bes_salesrank90DaysAverage || "N/A"}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Bought in past month: &nbsp;
                    {selectedProduct.bes_boughtInPastMonth + "+" || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Price Trend:{" "}
                    {getTrendIcon(
                      selectedProduct.bes_price,
                      selectedProduct.bes_priceBuyBox90DaysAverage
                    )}
                  </Typography>

                  <MDBox sx={{ paddingY: 2 }}>
                    <Typography
                      gutterBottom
                      sx={{
                        color: suggestedPrice > selectedProduct.bes_price ? "red" : "inherit",
                      }}
                    >
                      Suggested Price: ${parseFloat(suggestedPrice).toFixed(2)} USD
                    </Typography>
                    <Slider
                      value={suggestedPrice}
                      min={parseFloat(aliexpressSelectedProduct.target_sale_price)}
                      max={selectedProduct.bes_price * 1.5}
                      step={0.01}
                      onChange={(e, newValue) => setSuggestedPrice(newValue)}
                      valueLabelDisplay="auto"
                      disabled={loading}
                    />
                  </MDBox>

                  <Typography variant="body2" color="textSecondary">
                    Profit with Suggested Price: $
                    {parseFloat(
                      suggestedPrice - aliexpressSelectedProduct.target_sale_price
                    ).toFixed(2)}{" "}
                    per unit
                  </Typography>
                  {loading ? (
                    <MDBox display="flex" justifyContent="center">
                      <CircularProgress />
                    </MDBox>
                  ) : (
                    <MDButton
                      variant="contained"
                      fullWidth
                      color="primary"
                      sx={{
                        paddingY: 1.5,
                        marginTop: 2,
                        fontSize: "1rem",
                        fontWeight: "bold",
                        backgroundColor: "#3A75C4",
                        "&:hover": {
                          backgroundColor: "#315d9d",
                        },
                      }}
                      onClick={() => fetchAdditionalInfo()}
                    >
                      Add to My Products
                    </MDButton>
                  )}
                </CardContent>
              </Card>
            </Paper>
          </Grid>

          {/* Second Card (Charts) */}
          <Grid item xs={12} md={8}>
            <Paper elevation={4} sx={{ padding: 4, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Product Analysis
                </Typography>
                <Grid container spacing={4}>
                  {/* Price Trends */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Price Trends
                    </Typography>
                    <Line data={trendData} />
                  </Grid>

                  {/* Competition Trends */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Competition Trends
                    </Typography>
                    <Line data={trendData} />
                  </Grid>
                  {/* Price Comparison */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Price Comparison
                    </Typography>
                    <Bar data={priceComparisonData} />
                  </Grid>

                  {/* Profit Margin */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Profit Margin
                    </Typography>
                    <Bar data={profitMarginData} />
                  </Grid>
                </Grid>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>
      </MDBox>
      {/* Popup Dialog */}
      <Dialog open={openPopup} onClose={handleClosePopup} fullWidth maxWidth="md">
        <DialogTitle>Additional Product Information</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : additionalInfo ? (
            <>
              <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                Select Images:
              </Typography>
              <Grid container spacing={1}>
                {additionalInfo.imageURLs.map((url, index) => (
                  <Grid item xs={2} key={index}>
                    <Card
                      sx={{
                        border: selectedImages.includes(index)
                          ? "2px solid blue"
                          : "1px solid gray",
                        cursor: "pointer",
                        overflow: "hidden",
                        aspectRatio: "1 / 1",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                      onClick={() => handleImageToggle(index)}
                    >
                      <Box
                        component="img"
                        src={url}
                        alt={`Product ${index}`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                      <Checkbox
                        checked={selectedImages.includes(index)}
                        sx={{ position: "absolute", top: 0, right: 0 }}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                Select a Title:
              </Typography>
              <List>
                {additionalInfo.productTitles.map((title, index) => (
                  <ListItemButton
                    key={index}
                    selected={selectedTitle === index}
                    onClick={() => handleTitleSelect(index)}
                    onDoubleClick={() => handleTitleDoubleClick(index)}
                  >
                    {editingTitleIndex === index ? (
                      <TextField
                        value={title}
                        onChange={(e) => handleTitleChange(e, index)}
                        onBlur={handleEditComplete}
                        autoFocus
                        fullWidth
                        size="small"
                      />
                    ) : (
                      <ListItemText primary={title} />
                    )}
                  </ListItemButton>
                ))}
              </List>

              <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                Select a Description:
              </Typography>
              <List>
                {additionalInfo.productDescriptions.map((desc, index) => (
                  <ListItemButton
                    key={index}
                    selected={selectedDescription === index}
                    onClick={() => handleDescriptionSelect(index)}
                    onDoubleClick={() => handleDescriptionDoubleClick(index)}
                  >
                    {editingDescriptionIndex === index ? (
                      <TextField
                        value={desc}
                        onChange={(e) => handleDescriptionChange(e, index)}
                        onBlur={handleEditComplete}
                        autoFocus
                        fullWidth
                        size="small"
                      />
                    ) : (
                      <ListItemText primary={desc} />
                    )}
                  </ListItemButton>
                ))}
              </List>
            </>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No additional information available. Press Enhance Product to load.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleClosePopup} color="secondary">
            Close
          </MDButton>
          <MDButton color="primary" disabled={isPublishDisabled} onClick={handlePublishProduct}>
            Publish Product
          </MDButton>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </DashboardLayout>
  );
};

export default AliexpressDetail;
