import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#62984d", // Color corporativo principal
    },
    secondary: {
      main: "#262984",
    },
    background: {
      default: "#DDDDDD", // Fondo principal
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default theme;
