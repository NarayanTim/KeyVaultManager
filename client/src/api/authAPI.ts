import type { User_T } from "@/@types/user.t";
import { handleApiError, type ApiWithAuth } from "./axios/axiosSetup";


export const getUserProfile = async (apiWithAuth:ApiWithAuth):Promise<User_T> => {
    try {
        console.log("Test A")
        const endpoint: string = `/auth/profile`
        const response = await apiWithAuth<User_T>({
            url: endpoint,
            method: "GET"
        })
        console.log(JSON.stringify(response.user, null, 2) + " ---  --------- \n(Love)")
        return response.user
    } catch (error) {
        return handleApiError(error);
    }
}