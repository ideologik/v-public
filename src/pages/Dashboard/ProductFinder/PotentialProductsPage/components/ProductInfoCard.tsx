import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Slider,
  Link,
} from "@mui/material";
import { TrendIcon } from "../../../../../components/common/TrendIcon";

interface ProductInfoCardProps {
  selectedProduct: any;
  selectedProductForAnalysys: any;
  suggestedPrice: number;
  setSuggestedPrice: (value: number) => void;
  calculatePotentialProfit: () => string;
}

const ProductInfoCard: React.FC<ProductInfoCardProps> = ({
  selectedProduct,
  selectedProductForAnalysys,
  suggestedPrice,
  setSuggestedPrice,
  calculatePotentialProfit,
}) => {
  return (
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
          Sub-category: {selectedProduct.bes_productSubGroup || "N/A"}
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
          Potential Profit (monthly): ${calculatePotentialProfit()} USD
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginBottom: 1 }}
        >
          Sales Rank: {selectedProduct.bes_salesrank || "N/A"}{" "}
          <TrendIcon
            current={selectedProduct.bes_salesrank ?? 0}
            average={selectedProduct.bes_salesrank90DaysAverage ?? 0}
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
          Sold last month: &nbsp;
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
            average={selectedProduct.bes_priceBuyBox90DaysAverage ?? 0}
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
            Suggested Price: ${parseFloat(String(suggestedPrice)).toFixed(2)}{" "}
            USD
          </Typography>
          <Slider
            value={suggestedPrice}
            min={selectedProductForAnalysys?.price || 0}
            max={(selectedProduct.bes_price || 0) * 1.5}
            step={0.01}
            onChange={(_, newValue) => setSuggestedPrice(newValue as number)}
            valueLabelDisplay="auto"
            aria-label="Suggested Price Slider"
            sx={{ color: "#7CB342" }}
          />
        </Box>

        <Typography variant="body2" color="textSecondary">
          Profit with Suggested Price: $
          {(suggestedPrice - (selectedProductForAnalysys?.price || 0)).toFixed(
            2
          )}{" "}
          per unit
        </Typography>

        {/* Links */}
        <Box sx={{ marginTop: 2 }}>
          {selectedProduct.bes_link && (
            <Typography variant="body2" color="primary">
              <Link
                href={selectedProduct.bes_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Amazon
              </Link>
            </Typography>
          )}
          {selectedProductForAnalysys?.product_detail_url && (
            <Typography variant="body2" color="primary">
              <Link
                href={selectedProductForAnalysys.product_detail_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Shop on {selectedProductForAnalysys.platform}
              </Link>
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductInfoCard;
