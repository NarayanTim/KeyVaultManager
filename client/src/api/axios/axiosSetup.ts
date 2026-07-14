
import { useAuth } from "@clerk/react";
import axios, {type AxiosRequestConfig, type AxiosResponse} from "axios";
import { useCallback } from "react";

const INTERNAL_ERROR = "Internal Error";




const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

console.log(BASE_URL + " URL ")

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});



export const useApi = () => {
  const { getToken } = useAuth();

  const apiWithAuth = useCallback(
    async <T = unknown>( config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        const token = await getToken();

      console.log("Token exists:", !!token);
      console.log("Request URL:", `${api.defaults.baseURL}${config.url}`);

      return api.request<T>({
        ...config,
        headers: {
          ...config.headers,
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
      });
    },
    [getToken]
  );

  return { api, apiWithAuth };
};





export type ApiWithAuth = <T = unknown>(config: AxiosRequestConfig) => Promise<AxiosResponse<T>>;


export const handleApiError = (
  error: unknown
): never => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;

    if (error.response) {
      throw new Error(`${INTERNAL_ERROR}: ${message}`);
    }

    if (error.request) {
      throw new Error(
        `${INTERNAL_ERROR}: No response from server`
      );
    }

    throw new Error(`${INTERNAL_ERROR}: ${message}`);
  }

  if (error instanceof Error) {
    throw new Error(
      `${INTERNAL_ERROR}: ${error.message}`
    );
  }

  throw new Error(
    `${INTERNAL_ERROR}: Unknown error`
  );
};









// import { useAuth } from "@clerk/react";
// import axios from "axios";
// import { useCallback } from "react";
// const INTERNAL_ERROR = "internal error"



// const backendPortCall: number = Number(import.meta.env.VITE_BACKEND_BASE_PORT)||4000;

// // const BASE_URL: string = `http://localhost:${frontendPort}/api/`
// const BASE_URL: string = `${import.meta.env.VITE_BASE_API_URL}${backendPortCall}/api`

// const api = axios.create({
//     baseURL: BASE_URL,
//     headers: {
//         "Content-Type": "application/json",
//     },
//     withCredentials: true,
// })




// export const useApi = () => {
//   const { getToken } = useAuth();
//   const apiWithAuth = useCallback(
//     async <T>(config: Parameters<typeof api.request>[0]) => {
//       const token = await getToken();
//       return api.request<T>({
//         ...config,
//         headers: { ...config.headers, ...(token && { Authorization: `Bearer ${token}` }) },
//       });
//     },
//     [getToken]
//   );

//   return { api, apiWithAuth };
// };

// export const handleApiError = (error:unknown):never =>  {
//     if (axios.isAxiosError(error)) {
//         if (error.response) {
//             const message = error.response.data.messages
//             throw new Error(INTERNAL_ERROR + ": " + message);
//         } else if (error.request) {
//             throw new Error(INTERNAL_ERROR + ": No response from server");
//         } else {
//             throw new Error(INTERNAL_ERROR + ": " + error.message);
//         }
//     } else if (error instanceof Error) {
//         throw new Error(INTERNAL_ERROR + ": " + error.message);
//     } else {
//         throw new Error(INTERNAL_ERROR + ": Unknown error");
//     }
// }

