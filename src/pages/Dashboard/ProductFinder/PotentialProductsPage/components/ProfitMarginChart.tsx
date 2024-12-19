import React from "react";
import { Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";

interface ProfitMarginChartProps {
  selectedProductForAnalysys: any;
  suggestedPrice: number;
}

const ProfitMarginChart: React.FC<ProfitMarginChartProps> = ({
  selectedProductForAnalysys,
  suggestedPrice,
}) => {
  if (!selectedProductForAnalysys) {
    return (
      <Typography variant="body2" color="textSecondary">
        No data for profit margin.
      </Typography>
    );
  }

  const aePrice = selectedProductForAnalysys.price || 0;
  const absoluteProfit = suggestedPrice - aePrice;
  const profitPercentage =
    aePrice > 0 ? ((absoluteProfit / aePrice) * 100).toFixed(2) : 0;

  const data = {
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

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: { xs: 4, md: 0 } }}>
        Profit Margin
      </Typography>
      <Bar data={data} />
    </>
  );
};

export default ProfitMarginChart;
