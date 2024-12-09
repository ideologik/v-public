import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./Header/Header";
import FilterMenu from "./FilterMenu/FilterMenu";

// Este Layout pondrá el Header arriba, el contenido principal a la izquierda
// y el menú de filtros a la derecha, siendo el menú de filtros toggleable.

const MainLayout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Contenido principal ocupando el espacio restante */}
        <Box
          sx={{ flex: 1, overflow: "auto", backgroundColor: "#DDDDDD", p: 2 }}
        >
          <Outlet />
        </Box>

        {/* Menú de filtros a la derecha */}
        <FilterMenu />
      </Box>
    </Box>
  );
};

export default MainLayout;
