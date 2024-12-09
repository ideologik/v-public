import React, { useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { loginApi } from "../../../api/authService";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await loginApi(email, password);
      login(token);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper sx={{ p: 4, width: 300 }}>
        <Typography variant="h5" gutterBottom>
          Iniciar Sesión
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
          />
          <TextField
            label="Contraseña"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Entrar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
