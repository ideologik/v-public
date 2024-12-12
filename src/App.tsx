import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { useAuthStore } from "./store/authStore";
import { getToken } from "./utils/auth";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import { GlobalStyles } from "@mui/material"; // Importamos GlobalStyles

const App = () => {
  const { login } = useAuthStore();

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      login(storedToken);
    }
  }, [login]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={(theme) => ({
          "::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0,0,0,0.1)", // gris semitransparente
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.primary.main,
            borderRadius: "4px",
          },
          "::-webkit-scrollbar-thumb:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
        })}
      />

      <CssBaseline />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
