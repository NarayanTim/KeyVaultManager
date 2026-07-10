import { useApi } from "@/api/axios/axiosSetup";
import { useMutation } from "@tanstack/react-query";
import { authCallback } from './../api/authAPI';



export const useAuthCallBack = () => {
    const {apiWithAuth} = useApi()
    return useMutation({
        mutationFn: () => authCallback(apiWithAuth),
    })
}