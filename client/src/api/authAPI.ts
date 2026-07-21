import type { User } from "@/@types/user.t";
import {  type ApiWithAuth } from "./axios/axiosSetup";


export const getUserProfile = async (apiWithAuth:ApiWithAuth):Promise<User> => {
    const endpoint: string = `/auth/profile`
    const response = await apiWithAuth<{ user: User }>({
        url: endpoint,
        method: "GET",
    });

    return response.user

}