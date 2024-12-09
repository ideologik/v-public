import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useAuthStore } from "../../../store/authStore";
import { removeToken } from "../../../utils/auth";

interface HeaderProps {
  onToggleFilterMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleFilterMenu }) => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    removeToken();
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Vulcan Brand
        </Typography>
        <Button color="inherit" onClick={onToggleFilterMenu}>
          Toggle Filter
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
