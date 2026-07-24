import type { EnvVariableInput, Secrets } from "@/@types/EnvironmentVariables.t";
import { useApi } from "@/api/axios/axiosSetup";
import { getAllKey, saveAllChangeCall } from "@/api/keysAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



type InputID = string;

type SaveAllChangeInput = {
    id: InputID;
    inputData: EnvVariableInput[];
};

export const useGetAllKeys = (id:InputID) => {
    const { apiWithAuth } = useApi();
    return useQuery<Secrets[]>({
        queryKey: ["keys", id],
        queryFn: () => getAllKey(apiWithAuth, id),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        enabled: !!id,
    })
}

export const useSaveAllChange = () => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();

    return useMutation<Secrets[],Error, SaveAllChangeInput>({
        mutationFn: async ({id, inputData}:SaveAllChangeInput) => {
            return await saveAllChangeCall(apiWithAuth, id, inputData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"]});
            queryClient.invalidateQueries({queryKey: ["project"]});
            queryClient.invalidateQueries({queryKey: ["keys"]});
        }
    })
}