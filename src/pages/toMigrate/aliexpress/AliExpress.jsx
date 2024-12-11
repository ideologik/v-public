import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SearchFilter from "./SearchFilter";
import TableDeals from "./TableDeals";

function AliExpress() {
  // Estado para almacenar los filtros seleccionados
  return (
    <DashboardLayout>
      <DashboardNavbar />
    </DashboardLayout>
  );
}

export default AliExpress;
