import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CardShopifyProducts from "./CardShopifyProducts";

function ShopifyProducts() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <CardShopifyProducts />
    </DashboardLayout>
  );
}

export default ShopifyProducts;
