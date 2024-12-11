// src/components/layout/MainLayout.tsx
import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./Header/Header";
import FilterMenu from "./FilterMenu/FilterMenu";

const MainLayout = () => {
  const location = useLocation();

  let filterType = "productFinder";
  if (location.pathname.startsWith("/my-products")) {
    filterType = "myProducts";
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Box
          sx={{ flex: 1, overflow: "auto", backgroundColor: "#DDDDDD", p: 2 }}
        >
          <Outlet />
        </Box>
        <FilterMenu filterType={filterType} />
      </Box>
    </Box>
  );
};

export default MainLayout;
