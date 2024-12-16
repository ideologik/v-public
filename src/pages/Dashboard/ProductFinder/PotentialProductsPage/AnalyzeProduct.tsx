import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Card,
  CardContent,
  Paper,
  Slider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Bar, Line } from "react-chartjs-2";
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
import { toast } from "react-toastify";

import { getProductDetails } from "../../../../api/productFinderService"; // Ajustar la ruta real
import imageDefault from "../../../../assets/images/default-product-image.png";

import { useDateFilterStore } from "../../../../store/analyzeProductFilterStore";
import { TrendIcon } from "../../../../components/common/TrendIcon";
import { useSelectedProductsStore } from "../../../../store/selectedProductsStore";

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

// Función auxiliar para filtrar data según el rango
const filterDataByRange = (data: any, range: any) => {
  if (!data || data.length === 0) return [];
  if (range === "all") return data;

  const now = new Date();
  const startDate = new Date();

  switch (range) {
    case "1week":
      startDate.setDate(now.getDate() - 7);
      break;
    case "1month":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "3months":
      startDate.setMonth(now.getMonth() - 3);
      break;
    case "1year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return data;
  }

  return data.filter((entry: any) => {
    const entryDate = new Date(entry.date);
    return entryDate >= startDate && entryDate <= now;
  });
};

const AnalyzeProduct: React.FC = () => {
  const { selectedProduct, selectedProductForAnalysys } =
    useSelectedProductsStore();
  const { dateRange, setDateRange } = useDateFilterStore();

  const [productDetails, setProductDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [suggestedPrice, setSuggestedPrice] = useState<number>(
    selectedProduct?.bes_price || 0
  );

  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedProduct || !selectedProduct.bes_asin) return;
      setLoading(true);
      try {
        const data = await getProductDetails(selectedProduct.bes_asin);
        setProductDetails(data);
      } catch (error) {
        console.error("Error loading product details:", error);
        toast.error("Error loading product details");
      }
      setLoading(false);
    };
    fetchDetails();
  }, [selectedProduct]);

  const filteredMonthlySold = useMemo(
    () => filterDataByRange(productDetails?.historyMonthlySold, dateRange),
    [productDetails, dateRange]
  );
  const filteredRating = useMemo(
    () => filterDataByRange(productDetails?.historyRating, dateRange),
    [productDetails, dateRange]
  );

  const monthlySoldChartData = useMemo(() => {
    if (!filteredMonthlySold || filteredMonthlySold.length === 0) return null;
    return {
      labels: filteredMonthlySold.map((d: any) => d.date),
      datasets: [
        {
          label: "Monthly Units Sold",
          data: filteredMonthlySold.map((d: any) => d.count),
          borderColor: "#36A2EB",
          fill: false,
        },
      ],
    };
  }, [filteredMonthlySold]);

  const ratingChartData = useMemo(() => {
    if (!filteredRating || filteredRating.length === 0) return null;
    return {
      labels: filteredRating.map((d: any) => d.date),
      datasets: [
        {
          label: "Rating",
          data: filteredRating.map((d: any) => d.count),
          borderColor: "#FF6384",
          fill: false,
        },
      ],
    };
  }, [filteredRating]);

  const priceComparisonData = useMemo(() => {
    if (!selectedProduct || !selectedProductForAnalysys) return null;
    const aePrice = selectedProductForAnalysys?.price ?? 0;

    return {
      labels: ["Amazon", "AliExpress", "Suggested Price"],
      datasets: [
        {
          label: "Price in USD",
          data: [selectedProduct.bes_price ?? 0, aePrice, suggestedPrice],
          backgroundColor: ["#3A75C4", "#FF6384", "#4BC0C0"],
        },
      ],
    };
  }, [selectedProduct, selectedProductForAnalysys, suggestedPrice]);

  // Cálculo de la ganancia potencial
  const calculatePotentialProfit = () => {
    const aePrice = selectedProductForAnalysys?.price || 0;
    const monthlySales = selectedProduct?.bes_boughtInPastMonth || 0;
    const profitPerUnit = suggestedPrice - aePrice;
    return (profitPerUnit * monthlySales).toFixed(2);
  };

  return (
    <Box p={1} width="100%">
      {/* Encabezado y breadcrumbs */}
      <Typography variant="h5" gutterBottom>
        Analyze Product
      </Typography>
      {loading || !selectedProduct ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress />
        </Box>
      ) : productDetails ? (
        <>
          <Box mt={2}>
            <Grid container spacing={2} alignItems="stretch">
              {/* Columna Izquierda: Imágenes */}
              <Grid
                size={{ xs: 12, md: 4 }}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flex: 1, display: "flex" }}>
                    <Box display="flex" flex="1">
                      <Box
                        mr={2}
                        display="flex"
                        flexDirection="column"
                        gap="8px"
                        justifyContent="flex-start"
                      >
                        {/* Miniaturas (ejemplo estático) */}
                        {[...Array(5)].map((_, i) => (
                          <Box
                            key={i}
                            sx={{
                              width: "50px",
                              height: "50px",
                              backgroundColor: "#ccc",
                              border: "1px solid #ddd",
                            }}
                          />
                        ))}
                      </Box>
                      <Box
                        flex={1}
                        sx={{
                          border: "1px solid #ddd",
                          width: "100%",
                          aspectRatio: "1 / 1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <img
                          src={
                            selectedProductForAnalysys?.image || imageDefault
                          }
                          alt={selectedProductForAnalysys?.name || "Product"}
                          onError={(e) => {
                            e.currentTarget.src = imageDefault;
                          }}
                          referrerPolicy="no-referrer"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Columna Derecha: Detalles */}
              <Grid
                size={{ xs: 12, md: 8 }}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    padding: 2,
                    borderRadius: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Card
                    sx={{
                      borderRadius: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {selectedProductForAnalysys?.name || "Product Name"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: 1 }}
                      >
                        Category: {selectedProduct.bes_productGroup || "N/A"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: 1 }}
                      >
                        Sub-category:{" "}
                        {selectedProduct.bes_productSubGroup || "N/A"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: 1 }}
                      >
                        Current Price on Amazon: $
                        {selectedProduct.bes_price?.toFixed(2) || "N/A"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: 1 }}
                      >
                        Potential Profit (monthly): $
                        {calculatePotentialProfit()} USD
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: 1 }}
                      >
                        Sales Rank: {selectedProduct.bes_salesrank || "N/A"}{" "}
                        <TrendIcon
                          current={selectedProduct.bes_salesrank ?? 0}
                          average={
                            selectedProduct.bes_salesrank90DaysAverage ?? 0
                          }
                        />
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: 1 }}
                      >
                        Sale Rank last 90 days:{" "}
                        {selectedProduct.bes_salesrank90DaysAverage || "N/A"}
                      </Typography>
                      <Typography variant="h6" color="textSecondary">
                        Bought in past month: &nbsp;
                        {selectedProduct.bes_boughtInPastMonth
                          ? selectedProduct.bes_boughtInPastMonth + "+"
                          : "N/A"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: 1 }}
                      >
                        Price Trend:{" "}
                        <TrendIcon
                          current={selectedProduct.bes_price ?? 0}
                          average={
                            selectedProduct.bes_priceBuyBox90DaysAverage ?? 0
                          }
                        />
                      </Typography>

                      {/* Slider para ajustar suggestedPrice */}
                      <Box sx={{ paddingY: 2 }}>
                        <Typography
                          gutterBottom
                          sx={{
                            color:
                              suggestedPrice > (selectedProduct.bes_price || 0)
                                ? "red"
                                : "inherit",
                          }}
                        >
                          Suggested Price: $
                          {parseFloat(String(suggestedPrice)).toFixed(2)} USD
                        </Typography>
                        <Slider
                          value={suggestedPrice}
                          min={selectedProductForAnalysys?.price || 0}
                          max={(selectedProduct.bes_price || 0) * 1.5}
                          step={0.01}
                          onChange={(_, newValue) =>
                            setSuggestedPrice(newValue as number)
                          }
                          valueLabelDisplay="auto"
                          aria-label="Suggested Price Slider"
                          sx={{ color: "#7CB342" }}
                        />
                      </Box>

                      <Typography variant="body2" color="textSecondary">
                        Profit with Suggested Price: $
                        {(
                          suggestedPrice -
                          (selectedProductForAnalysys?.price || 0)
                        ).toFixed(2)}{" "}
                        per unit
                      </Typography>
                    </CardContent>
                  </Card>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Trends and History
            </Typography>

            {/* Select de rango de tiempo */}
            <Box mb={2} display="flex" justifyContent="flex-end">
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 150 }}
              >
                <InputLabel id="time-range-label">Time Range</InputLabel>
                <Select
                  labelId="time-range-label"
                  label="Time Range"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                >
                  <MenuItem value="1week">1 Week</MenuItem>
                  <MenuItem value="1month">1 Month</MenuItem>
                  <MenuItem value="3months">3 Months</MenuItem>
                  <MenuItem value="1year">1 Year</MenuItem>
                  <MenuItem value="all">All</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Monthly Units Sold */}
            <Typography variant="subtitle1" gutterBottom>
              Price, Units Sold, Competition
            </Typography>
            {monthlySoldChartData ? (
              <Line data={monthlySoldChartData} />
            ) : (
              <Typography variant="body2" color="textSecondary">
                No data available for selected range.
              </Typography>
            )}

            {/* Rating and Review */}
            <Box mt={4}>
              <Typography variant="subtitle1" gutterBottom>
                Rating and Review
              </Typography>
              {ratingChartData ? (
                <Line data={ratingChartData} />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No data available for selected range.
                </Typography>
              )}
            </Box>

            {/* Current Price Comparison */}
            <Box mt={4}>
              <Typography variant="subtitle1" gutterBottom>
                Current Price Comparison
              </Typography>
              {priceComparisonData ? (
                <Bar data={priceComparisonData} />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No data for price comparison.
                </Typography>
              )}
            </Box>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <Typography>No product details available.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default AnalyzeProduct;
