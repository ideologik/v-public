import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const FilterMenu: React.FC = () => {
  return (
    <Box
      sx={{
        width: 250,
        backgroundColor: "#ffffff",
        border: "1px solid #ccc",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        p: 2,
        zIndex: 10,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Filtros
      </Typography>
      {/* Aquí irían inputs, selects, sliders, etc. para filtrar */}
    </Box>
  );
};

export default FilterMenu;
