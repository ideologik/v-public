// src/api/stripeService.ts
import axiosClient from "./axiosClient";

// POST /io/stripe/webhook
export const stripeWebhook = async (payload: any) => {
  try {
    return await axiosClient.post("stripe/webhook", payload);
  } catch (error) {
    console.error("Error with stripe webhook:", error);
    throw error;
  }
};

// GET /io/stripe/GetSubscriptions
export const getStripeSubscriptions = async () => {
  try {
    return await axiosClient.get("stripe/GetSubscriptions");
  } catch (error) {
    console.error("Error fetching stripe subscriptions:", error);
    throw error;
  }
};
