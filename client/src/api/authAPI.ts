import type { User_T } from "@/@types/user.t";
import { handleApiError, type ApiWithAuth, type ApiResponse } from "./axios/axiosSetup";


export const getUserProfile = async (apiWithAuth:ApiWithAuth):Promise<User_T> => {
    try {
        console.log("Test A")
        const endpoint: string = `/auth/profile`
        const response = await apiWithAuth<ApiResponse>({
            url: endpoint,
            method: "GET"
        })
        return response.user
    } catch (error) {
        return handleApiError(error);
    }
}