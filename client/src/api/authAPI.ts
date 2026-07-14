import type { User_T } from "@/@types/user.t";
import { handleApiError, type ApiWithAuth } from "./axios/axiosSetup";


export const getUserProfile = async (apiWithAuth:ApiWithAuth) => {
    try {
        console.log("Test A")
        const endpoint: string = `/auth/profile`
        const response = await apiWithAuth<{ user: User_T }>({
            url: endpoint,
            method: "GET"
        })
        return response.data.user
    } catch (error) {
        return handleApiError(error);
    }
}