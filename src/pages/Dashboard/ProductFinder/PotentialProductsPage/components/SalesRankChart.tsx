import React from "react";
import { Typography } from "@mui/material";
import { ChartOptions, ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import { filterDataByRange } from "./utils/filterDataByRange";
import { formatDate } from "./utils/formatDate";
import { BestsellerProductDetails } from "../../../../../types/productFinder";

interface SalesRankChartProps {
  productDetails: BestsellerProductDetails;
  dateRange: string;
}

const SalesRankChart: React.FC<SalesRankChartProps> = ({
  productDetails,
  dateRange,
}) => {
  if (!productDetails || !productDetails.categoryAndSalesRanks) {
    return (
      <>
        <Typography variant="h6" gutterBottom>
          Sales rank trends
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No data available for selected range.
        </Typography>
      </>
    );
  }

  const categoryMap: Record<string, string> = {
    ...(productDetails.bes_productGroupId &&
      productDetails.bes_productGroup && {
        [String(productDetails.bes_productGroupId)]:
          productDetails.bes_productGroup,
      }),
    ...(productDetails.bes_productSubGroupId &&
      productDetails.bes_productSubGroup && {
        [String(productDetails.bes_productSubGroupId)]:
          productDetails.bes_productSubGroup,
      }),
    ...(productDetails.bes_productThirdGroupId &&
      productDetails.bes_productThirdGroup && {
        [String(productDetails.bes_productThirdGroupId)]:
          productDetails.bes_productThirdGroup,
      }),
  };

  const filteredCategorySales = productDetails.categoryAndSalesRanks
    .filter((cat: any) => categoryMap[String(cat.category_id)])
    .map((cat: any) => ({
      categoryName: categoryMap[String(cat.category_id)],
      category_id: cat.category_id,
      data: filterDataByRange(cat.dateAndSalesRank, dateRange),
    }));

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

  const datasets: ChartData<"line">["datasets"] = filteredCategorySales.map(
    (cat: any, index: number) => ({
      label: cat.categoryName ?? `Category ${cat.category_id}`,
      data: dateArray.map((d) => getVal(cat.data, d)),
      borderColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
      fill: false,
      yAxisID: `y-category-${cat.category_id}`,
      spanGaps: true,
    })
  );

  if (
    datasets.length === 0 ||
    datasets.every(
      (ds) => Array.isArray(ds.data) && ds.data.every((val) => val === null)
    )
  ) {
    return (
      <>
        <Typography variant="h6" gutterBottom>
          Sales rank trends
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No data available for selected range.
        </Typography>
      </>
    );
  }

  // Construimos las scales dinámicamente
  const scales = datasets.reduce((acc: any, ds: any, index: number) => {
    acc[ds.yAxisID] = {
      type: "linear",
      display: true,
      position: index % 2 === 0 ? "left" : "right",
      title: {
        display: true,
        text: ds.label,
      },
      grid: {
        drawOnChartArea: index === 0,
      },
      offset: true,
    };
    return acc;
  }, {});

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
    scales: scales,
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Sales rank trends
      </Typography>
      <Line data={data} options={options} />
    </>
  );
};

export default SalesRankChart;
