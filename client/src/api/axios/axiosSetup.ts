import { useAuth } from "@clerk/react";
import axios, { type AxiosRequestConfig } from "axios";
import { useCallback } from "react";

const INTERNAL_ERROR = "Internal Error";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// --- Backend response shapes ---
export interface ApiSuccessResponse<T> {
  success: true;
  code?: number;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  code: number;
  message?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type ApiWithAuth = <T = unknown>(config: AxiosRequestConfig) => Promise<T>;


export const useApi = () => {
  const { getToken } = useAuth();
  const apiWithAuth = useCallback(
    async <T = unknown>(
      config: AxiosRequestConfig
    ): Promise<T> => {
      const token = await getToken();

      const response = await api.request<ApiResponse<T>>({
        ...config,
        headers: {
          ...config.headers,
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
      });

      const body = response.data;

      if (!body.success) {
        throw new Error(body.message ?? "Request failed");
      }

      return body.data;
    },
    [getToken]
  );


  return { api, apiWithAuth };
};



export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;

    if (error.response) {
      throw new Error(`${INTERNAL_ERROR}: ${message}`);
    }

    if (error.request) {
      throw new Error(`${INTERNAL_ERROR}: No response from server`);
    }

    throw new Error(`${INTERNAL_ERROR}: ${message}`);
  }

  if (error instanceof Error) {
    throw new Error(`${INTERNAL_ERROR}: ${error.message}`);
  }

  throw new Error(`${INTERNAL_ERROR}: Unknown error`);
};
