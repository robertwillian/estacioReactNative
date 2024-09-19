import { api } from "./api";

export type AuthSuccessResponse = {
  status: true;
  data: string;
}

type RegisterResponse = {
  status: true;
  data: string;
} | {
  status: false;
  message: string;
}

type AuthRequestDTO = {
  email: string;
  password: string;
}

type RegisterRequestDTO = {
  email: string;
  password: string;
}

export const authService = async (data: AuthRequestDTO) => {
  return await api.post<AuthSuccessResponse>('/auth', data)
}

export const registerService = async (data: RegisterRequestDTO) => {
  return await api.post<AuthSuccessResponse>('/users', data)
}