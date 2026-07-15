import { getUserProfile } from "@/api/authAPI";
import { useApi } from "@/api/axios/axiosSetup";
import { useAuth } from "@clerk/react";
import {  useQuery } from "@tanstack/react-query";




// export const useUserProfile  = () => {
//     const { apiWithAuth } = useApi()
//     const {isLoaded, isSignedIn} = useAuth()
//     return useQuery({
//         queryKey: ["user_profile"],
//         queryFn: () => getUserProfile(apiWithAuth),
//         enabled: isLoaded && isSignedIn,
//         retry: false,
//     })
// }

export const useUserProfile = () => {
    const { apiWithAuth } = useApi();
    const { isLoaded, isSignedIn } = useAuth();

    const query = useQuery({
        queryKey: ["user_profile"],
        queryFn: () => getUserProfile(apiWithAuth),
        enabled: isLoaded && isSignedIn,
        retry: false,
    });

    return {
        ...query,
        isSignedIn,
        isLoaded,
    };
};