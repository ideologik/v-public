import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CardsMyProducts from "./CardsMyProducts";

function MyProducts() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <CardsMyProducts />
    </DashboardLayout>
  );
}

export default MyProducts;
