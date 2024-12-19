import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

const AnalyzeProduct: React.FC = () => {
  const { selectedProduct, selectedProductForAnalysys } =
    useSelectedProductsStore();
  const { dateRange } = useDateFilterStore();

  const [productDetails, setProductDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [suggestedPrice, setSuggestedPrice] = useState<number>(
    selectedProduct?.bes_price || 0
  );
  const [mainImage, setMainImage] = useState<string>(
    selectedProductForAnalysys?.image || imageDefault
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

  const calculatePotentialProfit = () => {
    const aePrice = selectedProductForAnalysys?.price || 0;
    const monthlySales = selectedProduct?.bes_boughtInPastMonth || 0;
    const profitPerUnit = suggestedPrice - aePrice;
    return (profitPerUnit * monthlySales).toFixed(2);
  };

  // Data existentes
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

  const profitMarginData = useMemo(() => {
    if (!selectedProductForAnalysys) return null;
    const aePrice = selectedProductForAnalysys.price || 0;
    const absoluteProfit = suggestedPrice - aePrice;
    const profitPercentage =
      aePrice > 0 ? ((absoluteProfit / aePrice) * 100).toFixed(2) : 0;
    return {
      labels: ["Profit Margin"],
      datasets: [
        {
          label: "Absolute Profit (USD)",
          data: [absoluteProfit],
          backgroundColor: "#36A2EB",
        },
        {
          label: "Profit Percentage",
          data: [profitPercentage],
          backgroundColor: "#FFCE56",
        },
      ],
    };
  }, [suggestedPrice, selectedProductForAnalysys]);

  // Nuevos datasets para los 3 nuevos gráficos
  // 1. Price & Sales trends
  const priceSalesData = useMemo(() => {
    if (!productDetails) return null;

    const amazonPrice = filterDataByRange(
      productDetails?.historyAmazonPriceTrend,
      dateRange
    );
    const newPrice = filterDataByRange(
      productDetails?.historyNewPriceTrend,
      dateRange
    );
    const monthlySold = filterDataByRange(
      productDetails?.historyMonthlySold,
      dateRange
    );

    const allDates = new Set<string>();
    [amazonPrice, newPrice, monthlySold].forEach((series) => {
      series?.forEach((d: any) => allDates.add(d.date));
    });

    const dateArray = Array.from(allDates).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    function getVal(series: any[], date: string, key: string) {
      if (!series) return null;
      const entry = series.find((d: any) => d.date === date);
      return entry ? entry[key] : null;
    }

    const datasets = [
      {
        label: "Amazon Price",
        data: dateArray.map((d) => getVal(amazonPrice, d, "price")),
        borderColor: "#FF6384",
        fill: false,
        yAxisID: "y-amazon",
        spanGaps: true,
      },
      {
        label: "New Price",
        data: dateArray.map((d) => getVal(newPrice, d, "price")),
        borderColor: "#36A2EB",
        fill: false,
        yAxisID: "y-newprice",
        spanGaps: true,
      },
      {
        label: "Monthly Units Sold",
        data: dateArray.map((d) => getVal(monthlySold, d, "count")),
        borderColor: "#4BC0C0",
        fill: false,
        yAxisID: "y-units",
        spanGaps: true,
      },
    ];

    return {
      labels: dateArray.map(formatDate),
      datasets,
    };
  }, [productDetails, dateRange]);

  // 2. Rating & Reviews
  const ratingReviewData = useMemo(() => {
    if (!productDetails) return null;
    const reviewsCount = filterDataByRange(
      productDetails?.historyReviewsCount,
      dateRange
    );
    const rating = filterDataByRange(productDetails?.historyRating, dateRange);

    const allDates = new Set<string>();
    [reviewsCount, rating].forEach((series) => {
      series?.forEach((d: any) => allDates.add(d.date));
    });

    const dateArray = Array.from(allDates).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    function getVal(series: any[], date: string, key: string) {
      if (!series) return null;
      const entry = series.find((d: any) => d.date === date);
      return entry ? entry[key] : null;
    }

    const datasets = [];
    if (reviewsCount?.length) {
      datasets.push({
        label: "Reviews Count",
        data: dateArray.map((d) => getVal(reviewsCount, d, "count")),
        borderColor: "#FF6384",
        fill: false,
        yAxisID: "y-reviews",
        spanGaps: true,
      });
    }
    if (rating?.length) {
      datasets.push({
        label: "Rating",
        data: dateArray.map((d) => getVal(rating, d, "count")),
        borderColor: "#36A2EB",
        fill: false,
        yAxisID: "y-rating",
        spanGaps: true,
      });
    }

    if (datasets.length === 0) return null;

    return {
      labels: dateArray.map(formatDate),
      datasets,
    };
  }, [productDetails, dateRange]);

  const ratingReviewOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      "y-reviews": {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Reviews Count",
        },
        grid: {
          drawOnChartArea: true,
        },
      },
      "y-rating": {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Rating",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // 3. Sales rank trends
  const salesRankData = useMemo(() => {
    if (!productDetails || !productDetails.categoryAndSalesRanks) return null;
    const categorySales = productDetails.categoryAndSalesRanks;
    const filteredCategorySales = categorySales.map((cat: any) => {
      const filtered = filterDataByRange(cat.dateAndSalesRank, dateRange);
      return { category_id: cat.category_id, data: filtered };
    });

    const allDates = new Set<string>();
    filteredCategorySales.forEach((cat: any) => {
      cat.data?.forEach((d: any) => allDates.add(d.date));
    });

    const dateArray = Array.from(allDates).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    function getVal(series: any[], date: string) {
      if (!series) return null;
      const entry = series.find((d: any) => d.date === date);
      return entry ? entry.salesrank : null;
    }

    const datasets = filteredCategorySales.map((cat: any, index: number) => ({
      label: `Category ${cat.category_id}`,
      data: dateArray.map((d) => getVal(cat.data, d)),
      borderColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
      fill: false,
      yAxisID: `y-category-${cat.category_id}`,
      spanGaps: true,
    }));

    return {
      labels: dateArray.map(formatDate),
      datasets,
    };
  }, [productDetails, dateRange]);

  const salesRankOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      ...productDetails?.categoryAndSalesRanks.reduce(
        (acc: any, cat: any, index: number) => {
          acc[`y-category-${cat.category_id}`] = {
            type: "linear",
            display: true,
            position: index % 2 === 0 ? "left" : "right",
            title: {
              display: true,
              text: `Category ${cat.category_id}`,
            },
            grid: {
              drawOnChartArea: index === 0, // Solo la primera categoría muestra la cuadrícula
            },
            offset: true, // Desplazar para evitar solapamiento
          };
          return acc;
        },
        {}
      ),
    },
  };

  return (
    <Box p={1} width="100%">
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
          {/* Primera fila: Dos columnas */}
          <Box mt={2}>
            <Grid container spacing={2} width="100%" alignItems="stretch">
              <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex" }}>
                <Card
                  sx={{
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "row",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Box
                    mt={2}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      alignItems: "center",
                      width: "100px",
                      overflow: "auto",
                    }}
                  >
                    {selectedProductForAnalysys?.images.map((image, i) => {
                      const thumbUrl = image;
                      return (
                        <Box
                          key={i}
                          sx={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: "#ccc",
                            border: "1px solid #ddd",
                            overflow: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onMouseEnter={() => setMainImage(thumbUrl)}
                        >
                          <img
                            src={thumbUrl}
                            alt={`Thumb ${i}`}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                            onError={(e) => {
                              e.currentTarget.src = imageDefault;
                            }}
                            referrerPolicy="no-referrer"
                          />
                        </Box>
                      );
                    })}
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottom: "1px solid #ddd",
                      p: 2,
                    }}
                  >
                    <img
                      src={mainImage}
                      alt={selectedProductForAnalysys?.name || "Product"}
                      onError={(e) => {
                        e.currentTarget.src = imageDefault;
                      }}
                      referrerPolicy="no-referrer"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                        display: "block",
                        margin: 0,
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Card
                  sx={{
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
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
                      Potential Profit (monthly): ${calculatePotentialProfit()}{" "}
                      USD
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
                    <Typography variant="body2" color="textSecondary">
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
              </Grid>
            </Grid>
          </Box>
          {/* Current Price Comparison */}
          <Box mt={4}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" gutterBottom>
                  Current Price Comparison
                </Typography>
                {priceComparisonData ? (
                  <Bar data={priceComparisonData} />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No data for price comparison.
                  </Typography>
                )}
              </Grid>

              {/* Profit Margin */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ mt: { xs: 4, md: 0 } }}
                >
                  Profit Margin
                </Typography>
                {profitMarginData ? (
                  <Bar data={profitMarginData} />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No data for profit margin.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>

          {/* Filas siguientes - Gráficos */}
          <Box mt={4}>
            {/* 1. Price & Sales trends */}
            <Typography variant="h6" gutterBottom>
              Price & Sales trends
            </Typography>
            {priceSalesData ? (
              <Line data={priceSalesData} />
            ) : (
              <Typography variant="body2" color="textSecondary">
                No data available for selected range.
              </Typography>
            )}

            {/* 2. Rating & Reviews */}
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Rating & Reviews
              </Typography>
              {ratingReviewData ? (
                <Line data={ratingReviewData} />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No data available for selected range.
                </Typography>
              )}
            </Box>

            {/* 3. Sales rank trends */}
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Sales rank trends
              </Typography>
              {salesRankData ? (
                <Line data={salesRankData} />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No data available for selected range.
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
