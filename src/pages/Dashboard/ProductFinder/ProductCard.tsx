// src/components/ProductCard.tsx
import React from "react";
import Slider from "react-slick";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  HorizontalRule,
} from "@mui/icons-material";
import { BestsellerProduct } from "../../../types/productFinder";

interface ProductCardProps {
  product: BestsellerProduct;
  refProp?: (node: HTMLDivElement | null) => void; // Por si necesitas la referencia para el infinite scroll
}

const getTrendIcon = (current: number, average: number) => {
  if (current > average) return <ArrowUpward style={{ color: "green" }} />;
  if (current < average) return <ArrowDownward style={{ color: "red" }} />;
  return <HorizontalRule style={{ color: "gray" }} />;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  refProp,
}) => {
  const name = product.bes_title || "No Name";
  const category = product.bes_productGroup || "N/A";
  const subcategory = product.bes_productSubGroup || "N/A";
  const price =
    product.bes_price !== null ? product.bes_price.toFixed(2) : "N/A";
  const brand = product.bes_brand || "N/A";
  const soldLastMonth =
    product.bes_boughtInPastMonth !== null
      ? product.bes_boughtInPastMonth + "+"
      : "N/A";

  let imageURL = "/assets/images/default-product-image.png";
  if (product.bes_imageURLs) {
    const imageArray = product.bes_imageURLs
      .split(",")
      .map((url) => url.trim());
    if (imageArray.length > 0) {
      imageURL = imageArray[0];
    }
  }

  return (
    <Card
      ref={refProp}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        component="img"
        image={imageURL}
        alt={name}
        sx={{ height: 200, objectFit: "contain" }}
      />
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h6"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mb: 1,
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mb: 1,
          }}
        >
          Category: {category}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mb: 1,
          }}
        >
          Subcategory: {subcategory}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mb: 1,
          }}
        >
          Brand: {brand}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Curent Price: ${price}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Sales Rank: {product.bes_salesrank || "N/A"}{" "}
          <Box component="span" sx={{ verticalAlign: "middle" }}>
            {getTrendIcon(
              product.bes_salesrank ?? 0,
              product.bes_salesrank90DaysAverage ?? 0
            )}
          </Box>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Sold last month: {soldLastMonth}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Price Trend:
          <Box component="span" sx={{ verticalAlign: "middle" }}>
            {getTrendIcon(
              product.bes_price ?? 0,
              product.bes_priceBuyBox90DaysAverage ?? 0
            )}
          </Box>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Competition Trend:
          <Box component="span" sx={{ verticalAlign: "middle" }}>
            {getTrendIcon(
              product.bes_newOfferCount ?? 0,
              product.bes_newOfferCount90DaysAverage ?? 0
            )}
          </Box>
        </Typography>

        <Box mt={2} display="flex" flexDirection="column" gap={1}>
          <Button variant="contained" color="primary" fullWidth>
            Find potential products
          </Button>
          <Button variant="contained" color="primary" fullWidth>
            Publish to Store
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
