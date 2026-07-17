import type { User } from "@/@types/user.t";
import { handleApiError, type ApiWithAuth, type ApiResponse } from "./axios/axiosSetup";


export const getUserProfile = async (apiWithAuth:ApiWithAuth):Promise<User> => {
    try {
        const endpoint: string = `/auth/profile`
        const response = await apiWithAuth<ApiResponse<{ user: User }>>({
            url: endpoint,
            method: "GET",
        });

        return response.user
    } catch (error) {
        return handleApiError(error);
    }
}