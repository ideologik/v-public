import axiosClient from "./axiosClient";
import { saveToken } from "../utils/auth";

interface UserResponse {
  user_id: number;
  user_email: string;
  user_name: string;
  user_password: string;
  user_token: string;
  user_tokenExpires: string;
}

export const loginApi = async (
  email: string,
  password: string
): Promise<string> => {
  const encodedPassword = btoa(password);

  const data = (await axiosClient.get("/users/login", {
    params: {
      email,
      password: encodedPassword,
    },
  })) as UserResponse;

  const { user_token } = data;
  saveToken(user_token);
  return user_token;
};
