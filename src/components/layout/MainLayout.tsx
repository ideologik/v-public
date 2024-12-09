import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import FilterMenu from "./FilterMenu/FilterMenu";

import Box from "@mui/material/Box";

const MainLayout = () => {
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header onToggleFilterMenu={() => setShowFilterMenu(!showFilterMenu)} />
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            position: "relative",
            p: 2,
            backgroundColor: "background.default",
          }}
        >
          {showFilterMenu && <FilterMenu />}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
