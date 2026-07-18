import { useApi } from "@/api/axios/axiosSetup";
import { addProject, getAllProject } from "@/api/projectAPI";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Project, ProjectInput, ProjectWithKey } from './../@types/project.t';


export const useAddProject = () => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();
    return useMutation<ProjectWithKey, Error, ProjectInput>({
        mutationFn: async (projectData:ProjectInput) => {
            return await addProject(apiWithAuth, projectData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["projects"]});
        }
    })
}

export const useGetProject = () => {
    const { apiWithAuth } = useApi();
    return useQuery<Project[]>({
        queryKey: ["projects"],
        queryFn: () => getAllProject(apiWithAuth),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    })
}