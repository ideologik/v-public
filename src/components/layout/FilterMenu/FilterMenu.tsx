import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useFilterStore } from "../../../store/filterStore";

const FilterMenu: React.FC = () => {
  const { filtersOpen } = useFilterStore();

  return (
    <Box
      sx={{
        width: 250,
        backgroundColor: "#ffffff",
        borderLeft: "1px solid #ccc",
        height: "100%",
        display: filtersOpen ? "block" : "none",
        padding: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Filtros
      </Typography>
      {/* Aquí van tus controles de filtrado (categoría, precio, etc.) */}
    </Box>
  );
};

export default FilterMenu;
