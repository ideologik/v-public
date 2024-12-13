import { NavLink, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpen from "@mui/icons-material/MenuOpen";
import { Box, Button } from "@mui/material";
import { useFilterStore } from "../../../store/filterStore";
import logoImage from "../../../assets/images/vulcan.png";

const Header = () => {
  const { filtersOpen, toggleFilters } = useFilterStore();
  const location = useLocation(); // Obtiene la ruta actual

  const handleFilterToggle = () => {
    toggleFilters();
  };

  // Definimos las rutas del menú
  const menuItems = [
    { label: "Products Finder", to: "/product-finder" },
    { label: "My Products", to: "/my-products" },
    { label: "Settings", to: "/settings" },
    { label: "Support", to: "/support" },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      {/* Barra Superior: Marca centrada, fondo negro */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "black", height: "5vh" }}
      >
        <Toolbar
          sx={{
            justifyContent: "center",
            minHeight: "5vh !important",
            padding: 0,
          }}
        >
          <img
            src={logoImage}
            alt="VULCAN Logo"
            style={{ height: "100%", objectFit: "contain" }}
          />
        </Toolbar>
      </AppBar>

      {/* Barra Inferior: Menú y botón de filtros. Fondo #FFFFFF */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "#FFFFFF", color: "black" }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", gap: 2, flexGrow: 1 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname.includes(item.to);
              return (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  sx={{
                    color: "black",
                    backgroundColor: isActive ? "#e0e0e0" : "transparent",
                    fontWeight: isActive ? "bold" : "normal",
                    textTransform: "none", // Para mantener el texto como está
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          <IconButton onClick={handleFilterToggle} sx={{ ml: 2 }}>
            {filtersOpen ? (
              <MenuOpen sx={{ color: "black" }} />
            ) : (
              <MenuIcon sx={{ color: "black" }} />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
