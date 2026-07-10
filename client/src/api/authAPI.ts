import type { User_T } from "@/@types/user.t";
import { handleApiError, type ApiWithAuth } from "./axios/axiosSetup";


export const authCallback = async (apiWithAuth:ApiWithAuth) => {
    try {
        const endpoint: string = `/auth/callback`
        const response = await apiWithAuth<{ user: User_T }>({
            url: endpoint,
            method: "POST"
        })
        console.log("Hi --------")
        if (response.status === 401) {
            return null;
        }
        return response.data.user
    } catch (error) {
        return handleApiError(error);
    }
}