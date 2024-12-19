import React from "react";
import { Typography } from "@mui/material";
import { ChartOptions, ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import { filterDataByRange } from "./utils/filterDataByRange";
import { formatDate } from "./utils/formatDate";

interface PriceSalesChartProps {
  productDetails: any;
  dateRange: string;
}

const PriceSalesChart: React.FC<PriceSalesChartProps> = ({
  productDetails,
  dateRange,
}) => {
  if (!productDetails) {
    return (
      <Typography variant="body2" color="textSecondary">
        No data available for selected range.
      </Typography>
    );
  }

  const amazonPrice = filterDataByRange(
    productDetails?.historyAmazonPriceTrend,
    dateRange
  );
  const newPrice = filterDataByRange(
    productDetails?.historyNewPriceTrend,
    dateRange
  );
  const ebayPrice = filterDataByRange(
    productDetails?.historyEbayPrice,
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

  const data: ChartData<"line"> = {
    labels: dateArray.map(formatDate),
    datasets: [
      {
        label: "Amazon Price",
        data: dateArray.map((d) => getVal(amazonPrice, d, "price")),
        borderColor: "#FF5733", // Naranja
        fill: false,
        yAxisID: "y-amazon",
        spanGaps: true,
      },
      {
        label: "New Price",
        data: dateArray.map((d) => getVal(newPrice, d, "price")),
        borderColor: "#2ECC71", // Verde
        fill: false,
        yAxisID: "y-newprice",
        spanGaps: true,
      },
      {
        label: "Ebay Price",
        data: dateArray.map((d) => getVal(ebayPrice, d, "price")),
        borderColor: "#3498DB", // Azul claro
        fill: false,
        yAxisID: "y-ebayprice",
        spanGaps: true,
      },
      {
        label: "Monthly Units Sold",
        data: dateArray.map((d) => getVal(monthlySold, d, "count")),
        borderColor: "#9B59B6", // Morado
        fill: false,
        yAxisID: "y-units",
        spanGaps: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      "y-amazon": {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Amazon Price",
        },
        grid: {
          drawOnChartArea: true,
        },
      },
      "y-newprice": {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "New Price",
        },
        grid: {
          drawOnChartArea: false, // evita que se superpongan las líneas de fondo
        },
      },
      "y-ebayprice": {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Ebay Price",
        },
        grid: {
          drawOnChartArea: false, // evita que se superpongan las líneas de fondo
        },
      },
      "y-units": {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Monthly Units Sold",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const hasData = data.datasets.some(
    (ds) => Array.isArray(ds.data) && ds.data.some((val) => val !== null)
  );

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Price & Sales trends
      </Typography>
      {hasData ? (
        <Line data={data} options={options} />
      ) : (
        <Typography variant="body2" color="textSecondary">
          No data available for selected range.
        </Typography>
      )}
    </>
  );
};

export default PriceSalesChart;
