import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useFilterStore } from "../../../store/filterStore";
import { Box, Button } from "@mui/material";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { toggleFilters } = useFilterStore();

  const handleFilterToggle = () => {
    toggleFilters();
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logo o texto de marca */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Vulcan Brand
        </Typography>

        {/* Menú principal horizontal */}
        {/* Puedes ajustar esto con Buttons, Links, etc. */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" href="/">
            Products Finder
          </Button>
          <Button color="inherit" href="/my-products">
            My Products
          </Button>
          <Button color="inherit" href="/shopify-products">
            Shopify Products
          </Button>
          <Button color="inherit" href="/settings">
            Settings
          </Button>
          <Button color="inherit" href="/support">
            Support
          </Button>
        </Box>

        {/* Ícono para toggle de filtros */}
        <IconButton color="inherit" onClick={handleFilterToggle} sx={{ ml: 2 }}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
