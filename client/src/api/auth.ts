import API from "./axios";
import type { RegisterData, LoginData } from "../types";

export const registerUser = (userData: RegisterData) => 
    API.post('/auth/register', userData);

export const loginUser = (loginData: LoginData) => 
    API.post('/auth/login', loginData);

export const verifyEmail = (token: string) =>
    API.get(`/auth/verify-email/${token}`)
