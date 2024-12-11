// src/components/layout/FilterMenu/FilterMenu.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import Slide from "@mui/material/Slide";
import ProductFinderFilters from "./ProductFinderFilters";
import MyProductsFilters from "./MyProductsFilters";
import { useFilterStore } from "../../../store/filterStore";

interface FilterMenuProps {
  filterType?: string;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  filterType = "productFinder",
}) => {
  const { filtersOpen } = useFilterStore();
  return (
    <Slide direction="left" in={filtersOpen} mountOnEnter unmountOnExit>
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
    </Slide>
  );
};

export default FilterMenu;
