import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { toast } from "react-toastify";

import { useDateFilterStore } from "../../../../store/analyzeProductFilterStore";
import { useSelectedProductsStore } from "../../../../store/selectedProductsStore";
import { getProductDetails } from "../../../../api/productFinderService";
import imageDefault from "../../../../assets/images/default-product-image.png";

import ProductImagesCard from "./components/ProductImagesCard";
import ProductInfoCard from "./components/ProductInfoCard";
import PriceComparisonChart from "./components/PriceComparisonChart";
import ProfitMarginChart from "./components/ProfitMarginChart";
import PriceSalesChart from "./components/PriceSalesChart";
import RatingReviewsChart from "./components/RatingReviewsChart";
import SalesRankChart from "./components/SalesRankChart";

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

// Registro de escalas y elementos
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
          {/* Primera fila: Imágenes e info del producto */}
          <Box mt={2}>
            <Grid container spacing={2} width="100%" alignItems="stretch">
              <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex" }}>
                <ProductImagesCard
                  selectedProductForAnalysys={selectedProductForAnalysys}
                  mainImage={mainImage}
                  setMainImage={setMainImage}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <ProductInfoCard
                  selectedProduct={selectedProduct}
                  selectedProductForAnalysys={selectedProductForAnalysys}
                  suggestedPrice={suggestedPrice}
                  setSuggestedPrice={setSuggestedPrice}
                  calculatePotentialProfit={calculatePotentialProfit}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Gráficos de líneas */}
          <Box mt={4}>
            <PriceSalesChart
              productDetails={productDetails}
              dateRange={dateRange}
            />

            <Box mt={4}>
              <RatingReviewsChart
                productDetails={productDetails}
                dateRange={dateRange}
              />
            </Box>

            <Box mt={4}>
              <SalesRankChart
                productDetails={productDetails}
                dateRange={dateRange}
              />
            </Box>
          </Box>
          {/* Gráficos de barra */}
          <Box mt={4}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <PriceComparisonChart
                  selectedProduct={selectedProduct}
                  selectedProductForAnalysys={selectedProductForAnalysys}
                  suggestedPrice={suggestedPrice}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <ProfitMarginChart
                  selectedProductForAnalysys={selectedProductForAnalysys}
                  suggestedPrice={suggestedPrice}
                />
              </Grid>
            </Grid>
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
