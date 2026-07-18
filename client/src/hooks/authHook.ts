import { getUserProfile } from "@/api/authAPI";
import { useApi } from "@/api/axios/axiosSetup";
import { useAuth } from "@clerk/react";
import {  useQuery } from "@tanstack/react-query";


export const useUserProfile = () => {
    const { apiWithAuth } = useApi();
    const { isLoaded, isSignedIn, userId } = useAuth();

    const query = useQuery({
        queryKey: ["user_profile", userId],
        queryFn: () => getUserProfile(apiWithAuth),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: isLoaded && isSignedIn,
        retry: 1,
    });

    return {
        ...query,
        isSignedIn,
        isLoaded,
    };
};