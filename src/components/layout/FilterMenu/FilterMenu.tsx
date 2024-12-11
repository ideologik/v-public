// src/components/layout/FilterMenu/FilterMenu.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import ProductFinderFilters from "./ProductFinderFilters";
import MyProductsFilters from "./MyProductsFilters";

interface FilterMenuProps {
  filterType?: string;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  filterType = "productFinder",
}) => {
  return (
    <Box
      sx={{
        width: 250,
        backgroundColor: "#ffffff",
        borderLeft: "1px solid #ccc",
        height: "100%",
        padding: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      {filterType === "productFinder" && <ProductFinderFilters />}
      {filterType === "myProducts" && <MyProductsFilters />}
    </Box>
  );
};

export default FilterMenu;
