import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  FormControl,
  InputAdornment,
  IconButton,
  OutlinedInput,
  InputLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import loginImage from "../../../assets/images/illustration-verification.jpg";
import { loginApi } from "../../../api/authService";
import { useAuthStore } from "../../../store/authStore";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("entro aca");
      const token = await loginApi(email, password);
      login(token);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Columna Izquierda con Imagen */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          backgroundImage: `url(${loginImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Columna Derecha con el Formulario */}
      <Grid
        size={{ xs: 12, md: 6 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box sx={{ width: "100%", maxWidth: 400, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Sign In
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Enter your email and password to sign in
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              type="email"
              autoComplete="email"
            />

            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              type="submit"
            >
              Sign In
            </Button>

            <Typography variant="body2" textAlign="center">
              Don&apos;t have an account?{" "}
              <Link href="/signup" variant="button">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
