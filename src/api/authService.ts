import axios from "axios";
import { saveToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const loginApi = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  const { token } = response.data;
  saveToken(token);
  return token;
};
