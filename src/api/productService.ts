import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getProducts = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
