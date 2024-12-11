import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import { useAtom } from "jotai";
import { aliexpressSelectedProductAtom, bsSelectedProductAtom } from "stores/productAtom";
import { aliExpressProductEnhancer, fetchAliExpressGetProductByID } from "services";
import { toast, ToastContainer } from "react-toastify";
import { Bar, Line } from "react-chartjs-2";
import Slider from "@material-ui/core/Slider";
import "react-toastify/dist/ReactToastify.css";
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
import { ArrowUpward, ArrowDownward, HorizontalRule } from "@mui/icons-material";
import PublishProductDialog from "./PublishProductDialog"; // Import the new component

const getTrendIcon = (current, average) => {
  if (current > average) return <ArrowUpward style={{ color: "green" }} />;
  if (current < average) return <ArrowDownward style={{ color: "red" }} />;
  return <HorizontalRule style={{ color: "gray" }} />;
};
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

const ProductCardWithGallery = () => {
  const [aliexpressSelectedProduct] = useAtom(aliexpressSelectedProductAtom);
  const [selectedProduct] = useAtom(bsSelectedProductAtom);
  const [mainMedia, setMainMedia] = useState(aliexpressSelectedProduct.product_main_image_url);
  const [mainMediaType, setMainMediaType] = useState("image"); // Control whether it's an image or video
  const [suggestedPrice, setSuggestedPrice] = useState(selectedProduct.bes_price || 0);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [productMedia, setProductMedia] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch additional product information
    const fetchAdditionalProductInfo = async () => {
      try {
        const response = await fetchAliExpressGetProductByID(aliexpressSelectedProduct.product_id);
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
          setAdditionalInfo({
            ...result,
            productTitles: [productTitle],
            productDescriptions: [productDescription],
            imageURLs,
          });
        }
      } catch (error) {
        console.error("Error fetching additional product info:", error);
      }
    };

    fetchAdditionalProductInfo();
  }, [aliexpressSelectedProduct.product_id]);

  useEffect(() => {
    if (additionalInfo) {
      // Get videos
      let productVideos = additionalInfo?.ae_multimedia_info_dto?.ae_video_dtos?.ae_video_d_t_o;

      // Ensure productVideos is an array
      if (productVideos) {
        if (!Array.isArray(productVideos)) {
          productVideos = [productVideos];
        }
      } else {
        productVideos = [];
      }

      // Get images
      let productImages = additionalInfo?.imageURLs;
      if (!productImages) {
        productImages = [];
      }

      // Combine videos and images into one media array
      setProductMedia([
        ...productVideos.map((video) => ({
          type: "video",
          url: video.media_url,
          poster: video.poster_url,
        })),
        ...productImages.map((image) => ({ type: "image", url: image })),
      ]);
    }
  }, [additionalInfo]);

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

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const calculatePotentialProfit = () => {
    const profitPerUnit = suggestedPrice - parseFloat(aliexpressSelectedProduct.target_sale_price);
    return (profitPerUnit * selectedProduct.bes_boughtInPastMonth).toFixed(2);
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

  // Data for the bar chart for profit margin
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

  return (
    <DashboardLayout>
      <MDBox
        sx={{
          display: "flex",
          gap: 3,
          padding: 4,
        }}
      >
        {/* Left Column - Product Information */}
        <Paper elevation={4} sx={{ flex: 3, borderRadius: 2, display: "flex", gap: 3 }}>
          {/* Thumbnail Image Gallery */}
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              width: "100px",
              height: "auto",
              overflow: "auto",
              padding: 1,
            }}
          >
            {productMedia.map((media, index) => (
              <MDBox
                key={index}
                component={media.type === "image" ? "img" : "video"}
                src={media.url}
                alt={`Thumbnail ${index}`}
                poster={media.type === "video" ? media.poster : undefined}
                onClick={() => {
                  setMainMedia(media.url);
                  setMainMediaType(media.type);
                }}
                onMouseEnter={() => {
                  setMainMedia(media.url);
                  setMainMediaType(media.type);
                }}
                sx={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  cursor: "pointer",
                  border: mainMedia === media.url ? "2px solid #FF3E3E" : "2px solid transparent",
                }}
                controls={media.type === "video"}
              />
            ))}
          </MDBox>

          {/* Main Product Card */}
          <MDBox sx={{ flex: 1 }}>
            <Card
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Main Media (Image or Video) */}
              <MDBox
                sx={{
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Discount or Event Label */}
                {aliexpressSelectedProduct.discount && (
                  <MDBox
                    sx={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      backgroundColor: "#FF6347",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                    }}
                  >
                    {aliexpressSelectedProduct.discount} OFF
                  </MDBox>
                )}

                {mainMediaType === "image" ? (
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
                      component="img"
                      src={mainMedia || "/assets/imgs/default-product-image.png"}
                      alt={aliexpressSelectedProduct.product_title}
                      sx={{
                        width: "100%",
                        height: "40vh",
                        objectFit: "contain",
                      }}
                    />
                  </Card>
                ) : (
                  <MDBox
                    component="video"
                    src={mainMedia}
                    poster={mainMedia.poster}
                    controls
                    sx={{
                      width: "100%",
                      height: "40vh",
                      objectFit: "contain",
                    }}
                  />
                )}
              </MDBox>

              {/* Product Content */}
              <CardContent sx={{ padding: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {aliexpressSelectedProduct.product_title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                  Category: {aliexpressSelectedProduct.second_level_category_name || "N/A"}
                </Typography>

                {/* Current Price and Discount */}
                <Typography
                  variant="h5"
                  color="primary"
                  sx={{ fontWeight: "bold", marginBottom: 1 }}
                >
                  ${aliexpressSelectedProduct.target_sale_price}{" "}
                  <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                    sx={{ textDecoration: "line-through", marginLeft: 1 }}
                  >
                    ${aliexpressSelectedProduct.original_price}
                  </Typography>
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
                <Grid item xs={12} md={8}>
                  <Paper elevation={4} sx={{ padding: 4, borderRadius: 2 }}>
                    <Grid container spacing={4}>
                      {/* Price Trends */}
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Price & Competition Trends
                        </Typography>
                        <Line data={trendData} />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </CardContent>
            </Card>
          </MDBox>
        </Paper>

        {/* Right Column - Buttons and Options */}
        <MDBox sx={{ flex: 1 }}>
          <Paper
            elevation={4}
            sx={{
              padding: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Buttons */}
            {loading ? (
              <MDBox display="flex" justifyContent="center">
                <CircularProgress />
              </MDBox>
            ) : (
              <MDButton
                variant="contained"
                color="primary"
                onClick={() => fetchAdditionalInfo()}
                disabled={false}
              >
                Add to My Products
              </MDButton>
            )}

            <Divider />
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
              />
            </MDBox>

            <Typography variant="body2" color="textSecondary">
              Profit with Suggested Price: $
              {parseFloat(suggestedPrice - aliexpressSelectedProduct.target_sale_price).toFixed(2)}{" "}
              per unit
            </Typography>
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
          </Paper>
        </MDBox>
      </MDBox>

      {/* Popup Dialog */}
      <PublishProductDialog
        open={openPopup}
        onClose={handleClosePopup}
        loading={loading}
        setLoading={setLoading}
        additionalInfo={additionalInfo}
        suggestedPrice={suggestedPrice}
      />

      <ToastContainer />
    </DashboardLayout>
  );
};

export default ProductCardWithGallery;
