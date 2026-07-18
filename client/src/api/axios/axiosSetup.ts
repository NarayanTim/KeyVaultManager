import { useAuth } from "@clerk/react";
import axios, { type AxiosRequestConfig } from "axios";
import { useCallback } from "react";

// const UNKNOWN_ERROR = "UNKNOWN Error";

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


// export const useApi = () => {
//   const { getToken } = useAuth();
//   const apiWithAuth = useCallback(
//     async <T = unknown>(
//       config: AxiosRequestConfig
//     ): Promise<T> => {
//       const token = await getToken();

//       const response = await api.request<ApiResponse<T>>({
//         ...config,
//         headers: {
//           ...config.headers,
//           ...(token && {
//             Authorization: `Bearer ${token}`,
//           }),
//         },
//       });

//       const body = response.data;

//       if (!body.success) {
//         throw new Error(body.error.error.message ?? "Request failed");
//       }

//       return body.data;
//     },
//     [getToken]
//   );


//   return { api, apiWithAuth };
// };



// export const useApi = () => {
//   const { getToken } = useAuth();

//   const apiWithAuth = useCallback(
//     async <T = unknown>(config: AxiosRequestConfig): Promise<T> => {
//       try {
//         const token = await getToken();

//         const response = await api.request<ApiResponse<T>>({
//           ...config,
//           headers: {
//             ...config.headers,
//             ...(token && {
//               Authorization: `Bearer ${token}`,
//             }),
//           },
//         });

//         const body = response.data;

//         if (!body.success) {
//           // throw new Error(body.message ?? "Request failed");
//           throw new Error(body.error.error.message ?? "Request failed");
//         }

//         return body.data;
//       } catch (error) {
//         if (axios.isAxiosError(error)) {
//           const message =
//             error.response?.data?.message ??
//             error.response?.data?.error?.message ??
//             error.message;

//           throw new Error(message);
//         }

//         throw error;
//       }
//     },
//     [getToken]
//   );

//   return { api, apiWithAuth };
// };

export const useApi = () => {
  const { getToken } = useAuth();

  const apiWithAuth = useCallback(
    async <T = unknown>(config: AxiosRequestConfig): Promise<T> => {
      try {
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
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("STATUS:", error.response?.status);
          console.log("DATA:", error.response?.data);
          // const responseData = error.response?.data.error?.message | error.response?.data.message;
          const responseData = error.response?.data.error?.message;
          console.log("DATA 2 :", responseData);
          
          const mgs = responseData;
          console.log("DATA 2 --- 4344:", mgs);
          const message = getErrorMessage(mgs)
          
          console.log("DATA 2 ---:", message);
          throw new Error(message, { cause: error });

        }

        throw error;
      }
    },
    [getToken]
  );

  return { api, apiWithAuth };
};


const UNKNOWN_ERROR = "Unknown error";

export const getErrorMessage = (message: unknown): string => {
    // Simple string message
    if (typeof message === "string") {
        return message;
    }

    // Field validation errors
    if (message && typeof message === "object") {
        const values = Object.values(message);

        const errors = values.filter(
            (value): value is string => typeof value === "string"
        );

        if (errors.length > 0) {
            return errors.join(", ");
        }
    }

    return UNKNOWN_ERROR;
};

// export const getErrorMessage = (error: unknown): string => {
//     if (typeof error === "string") {
//         return error;
//     }

//     if (!error || typeof error !== "object") {
//         return UNKNOWN_ERROR;
//     }

//     const data = error as Record<string, unknown>;

//     const message = data.message;

//     if (typeof message === "string") {
//         return message;
//     }

//     if (message && typeof message === "object") {
//         const values = Object.values(message);

//         const stringValues = values.filter(
//             (value): value is string => typeof value === "string"
//         );

//         if (stringValues.length > 0) {
//             return stringValues.join(", ");
//         }
//     }

//     return UNKNOWN_ERROR;
// };

// export const getErrorMessage = (error: unknown): string => {
//     if (!error || typeof error !== "object") {
//         return UNKNOWN_ERROR;
//     }

//     const data = error as Record<string, unknown>;

//     const message = data.message;

//     if (typeof message === "string") {
//         return message;
//     }

//     if (message && typeof message === "object") {
//         const values = Object.values(message);

//         const stringValues = values.filter(
//             (value): value is string => typeof value === "string"
//         );

//         if (stringValues.length > 0) {
//             return stringValues.join(", ");
//         }
//     }

//     return UNKNOWN_ERROR;
// };


export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    console.error("API Error:", error.response?.data);

    const responseData = error.response?.data;

    let message = "Unknown error";

    if (typeof responseData?.message === "string") {
      message = responseData.message;
    } else if (typeof responseData?.error === "string") {
      message = responseData.error;
    } else if (error.message) {
      message = error.message;
    }

    throw new Error(message);
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error("Unknown error");
};


// export const handleApiError = (error: unknown): never => {
//   if (axios.isAxiosError(error)) {
//     const message = error.response?.data?.message || error.response?.data?.error || error.message;

//     if (error.response) {
//       throw new Error(`${INTERNAL_ERROR}: ${message}`);
//     }

//     if (error.request) {
//       throw new Error(`${INTERNAL_ERROR}: No response from server`);
//     }

//     throw new Error(`${INTERNAL_ERROR}: ${message}`);
//   }

//   if (error instanceof Error) {
//     throw new Error(`${INTERNAL_ERROR}: ${error.message}`);
//   }

//   throw new Error(`${INTERNAL_ERROR}: Unknown error`);
// };
