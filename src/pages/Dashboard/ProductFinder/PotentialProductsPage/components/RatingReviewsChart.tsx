import React from "react";
import { Typography } from "@mui/material";
import { ChartOptions, ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import { filterDataByRange } from "./utils/filterDataByRange";
import { formatDate } from "./utils/formatDate";

interface RatingReviewsChartProps {
  productDetails: any;
  dateRange: string;
}

const RatingReviewsChart: React.FC<RatingReviewsChartProps> = ({
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

  const datasets: ChartData<"line">["datasets"] = [];

  if (reviewsCount.length > 0) {
    const data = dateArray.map((d) => getVal(reviewsCount, d, "count"));
    if (data.some((val) => val !== null)) {
      datasets.push({
        label: "Reviews Count",
        data,
        borderColor: "#FF6384", // Rojo
        fill: false,
        yAxisID: "y-reviews",
        spanGaps: true,
      });
    }
  }

  if (rating.length > 0) {
    const data = dateArray.map((d) => getVal(rating, d, "count"));
    if (data.some((val) => val !== null)) {
      datasets.push({
        label: "Rating",
        data,
        borderColor: "#36A2EB", // Azul
        fill: false,
        yAxisID: "y-rating",
        spanGaps: true,
      });
    }
  }

  if (datasets.length === 0) {
    return (
      <>
        <Typography variant="h6" gutterBottom>
          Rating & Reviews
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No data available for selected range.
        </Typography>
      </>
    );
  }

  const data: ChartData<"line"> = {
    labels: dateArray.map(formatDate),
    datasets,
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
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
      },
      "y-rating": {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Rating",
        },
      },
    },
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Rating & Reviews
      </Typography>
      <Line data={data} options={options} />
    </>
  );
};

export default RatingReviewsChart;
