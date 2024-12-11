// src/api/allGoodService.ts
import axiosClient from "./axiosClient";

// GET /
export const allGood = async () => {
  try {
    return await axiosClient.get("/");
  } catch (error) {
    console.error("Error fetching all good endpoint:", error);
    throw error;
  }
};
