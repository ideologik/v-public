import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { useAuthStore } from "./store/authStore";
import { getToken } from "./utils/auth";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import CssBaseline from "@mui/material/CssBaseline";

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
      <CssBaseline />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
