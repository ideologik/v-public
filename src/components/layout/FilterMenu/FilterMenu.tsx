// src/components/layout/FilterMenu/FilterMenu.tsx
import React from "react";
import { Box, Card } from "@mui/material";
import Slide from "@mui/material/Slide";
import ProductFinderFilters from "./ProductFinderFilters";
import MyProductsFilters from "./MyProductsFilters";
import { useFilterStore } from "../../../store/filterStore";
import PotentialProductsFilters from "./PotentialProductsFilters";
import AnalyzeProductFilters from "./AnalyzeProductFilters";

interface FilterMenuProps {
  filterType?: string;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  filterType = "productFinder",
}) => {
  const { filtersOpen } = useFilterStore();
  return (
    <>
      <Slide direction="left" in={filtersOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            width: 250,
            backgroundColor: "transparent", // Dejar transparente para que se vea el fondo #DDDDDD del layout
            height: "100%",
            p: 1,
          }}
        >
          <Card
            sx={{
              borderRadius: 2, // Bordes redondeados
              p: 2, // Padding interno para los contenidos del filtro
              minHeight: "100%",
            }}
          >
            {filterType === "productFinder" && <ProductFinderFilters />}
            {filterType === "myProducts" && <MyProductsFilters />}
            {filterType === "potentialProducts" && <PotentialProductsFilters />}
            {filterType === "analyzeProducts" && <AnalyzeProductFilters />}
          </Card>
        </Box>
      </Slide>
    </>
  );
};

export default FilterMenu;
