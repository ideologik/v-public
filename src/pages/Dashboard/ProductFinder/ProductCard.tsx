import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  HorizontalRule,
} from "@mui/icons-material";
import { BestsellerProduct } from "../../../types/productFinder";
import { usePotentialProductsFilterStore } from "../../../store/potentialProductsFilterStore";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ProductCardProps {
  product: BestsellerProduct;
  refProp?: (node: HTMLDivElement | null) => void;
}

const getImagesArray = (imageURLs: string | null): string[] => {
  if (!imageURLs) return ["/assets/images/default-product-image.png"];
  return imageURLs
    .split(",")
    .map((url) => url.trim())
    .filter((url) => url !== "");
};

const getTrendIcon = (current: number, average: number) => {
  if (current > average) return <ArrowUpward style={{ color: "green" }} />;
  if (current < average) return <ArrowDownward style={{ color: "red" }} />;
  return <HorizontalRule style={{ color: "gray" }} />;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  refProp,
}) => {
  const SlickSlider = Slider as unknown as React.ComponentType<any>;
  const navigate = useNavigate();

  const { setSelectedProduct, setSourcingPlatform, setSelectedProductImage } =
    usePotentialProductsFilterStore();

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

  const images = getImagesArray(product.bes_imageURLs);
  const isSingleImage = images.length === 1;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const sliderSettings = {
    dots: false,
    infinite: !isSingleImage,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: !isSingleImage,
    adaptiveHeight: true,
    afterChange: (current: number) => {
      setCurrentImageIndex(current);
    },
  };

  const handleFindPotentialProducts = () => {
    setSelectedProduct(product);
    setSourcingPlatform("aliexpress");
    const currentImageUrl = images[currentImageIndex] || null;
    setSelectedProductImage(currentImageUrl);
    navigate("/product-finder/results");
  };

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
      <Box
        sx={{
          height: "30vh",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SlickSlider
          {...sliderSettings}
          style={{
            width: "100%",
            height: "100%",
            cursor: "grab",
          }}
        >
          {images.map((img, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "90%",
              }}
            >
              <img
                src={img}
                alt={`${name} - ${idx}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Box>
          ))}
        </SlickSlider>
      </Box>

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
          Current Price: ${price}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Sales Rank: {product.bes_salesrank ?? "N/A"}{" "}
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
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFindPotentialProducts}
          >
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
