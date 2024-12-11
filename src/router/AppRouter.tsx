import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import { ProductFinderPage } from "../pages/Dashboard/ProductFinder/ProductFinderPage";
import Login from "../pages/Auth/Login/Login";
import { MyProductsPage } from "../pages/Dashboard/MyProducts/MyProductsPage";
import UnauthorizedPage from "../pages/Errors/UnauthorizedPage";
import NotFoundPage from "../pages/Errors/NotFoundPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rutas de error */}
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
      </Route>
    </Routes>
  );
};

export default AppRouter;
