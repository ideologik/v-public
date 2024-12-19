import React from "react";
import { Box, Card } from "@mui/material";
import imageDefault from "../../../../../assets/images/default-product-image.png";

interface ProductImagesCardProps {
  selectedProductForAnalysys: any;
  mainImage: string;
  setMainImage: (img: string) => void;
}

const ProductImagesCard: React.FC<ProductImagesCardProps> = ({
  selectedProductForAnalysys,
  mainImage,
  setMainImage,
}) => {
  return (
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
        {selectedProductForAnalysys?.images?.map((image: string, i: number) => (
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
            onMouseEnter={() => setMainImage(image)}
          >
            <img
              src={image}
              alt={`Thumb ${i}`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = imageDefault;
              }}
              referrerPolicy="no-referrer"
            />
          </Box>
        ))}
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
            (e.currentTarget as HTMLImageElement).src = imageDefault;
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
  );
};

export default ProductImagesCard;
