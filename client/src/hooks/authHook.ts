import { getUserProfile } from "@/api/authAPI";
import { useApi } from "@/api/axios/axiosSetup";
import {   useQuery } from "@tanstack/react-query";




export const useUserProfile  = () => {
    const { apiWithAuth } = useApi()
    return useQuery({
        queryKey: ["user_profile"],
        queryFn: () => getUserProfile(apiWithAuth),
        retry: false,
    })

}