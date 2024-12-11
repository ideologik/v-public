import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { useFilterStore } from "../../../store/filterStore";

const FilterMenu: React.FC = () => {
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
          Filtros
        </Typography>
        {/* Aquí irán tus controles de filtrado */}
      </Box>
    </Slide>
  );
};

export default FilterMenu;
