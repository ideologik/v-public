import React from "react";
import { Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";

interface PriceComparisonChartProps {
  selectedProduct: any;
  selectedProductForAnalysys: any;
  suggestedPrice: number;
}

const PriceComparisonChart: React.FC<PriceComparisonChartProps> = ({
  selectedProduct,
  selectedProductForAnalysys,
  suggestedPrice,
}) => {
  if (!selectedProduct || !selectedProductForAnalysys) {
    return (
      <Typography variant="body2" color="textSecondary">
        No data for price comparison.
      </Typography>
    );
  }

  const aePrice = selectedProductForAnalysys?.price ?? 0;
  const data = {
    labels: ["Amazon", "AliExpress", "Suggested Price"],
    datasets: [
      {
        label: "Price in USD",
        data: [selectedProduct.bes_price ?? 0, aePrice, suggestedPrice],
        backgroundColor: ["#3A75C4", "#FF6384", "#4BC0C0"],
      },
    ],
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Current Price Comparison
      </Typography>
      <Bar data={data} />
    </>
  );
};

export default PriceComparisonChart;
