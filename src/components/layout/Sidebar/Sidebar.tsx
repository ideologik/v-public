import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import { NavLink } from "react-router-dom";
import Typography from "@mui/material/Typography";

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 200,
        backgroundColor: "#f5f5f5",
        borderRight: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <List sx={{ flex: 1 }}>
        <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <ListItemButton>
            <Typography>Product Finder</Typography>
          </ListItemButton>
        </NavLink>
        <NavLink
          to="/my-products"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemButton>
            <Typography>My Products</Typography>
          </ListItemButton>
        </NavLink>
        <NavLink
          to="/shopify-products"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemButton>
            <Typography>Shopify Products</Typography>
          </ListItemButton>
        </NavLink>
      </List>
    </Box>
  );
};

export default Sidebar;
