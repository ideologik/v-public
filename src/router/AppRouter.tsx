// src/router/AppRouter.tsx
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import { ProductFinderPage } from "../pages/Dashboard/ProductFinder/ProductFinderPage";
import Login from "../pages/Auth/Login/Login";
import { MyProductsPage } from "../pages/Dashboard/MyProducts/MyProductsPage";
import UnauthorizedPage from "../pages/Errors/UnauthorizedPage";
import NotFoundPage from "../pages/Errors/NotFoundPage";
import PotentialProductsPage from "../pages/Dashboard/ProductFinder/PotentialProductsPage/PotentialProductsPage";

// Este sería el componente que mostrará resultados de AE y CJ juntos.

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/notFound" element={<NotFoundPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProductFinderPage />} />
        <Route path="my-products" element={<MyProductsPage />} />

        {/* Rutas hijas de product-finder */}
        <Route path="product-finder">
          {/* Página principal de Product Finder */}
          <Route index element={<ProductFinderPage />} />

          {/* Página para mostrar resultados (AE, CJ o mixto) */}
          <Route path="results" element={<PotentialProductsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
