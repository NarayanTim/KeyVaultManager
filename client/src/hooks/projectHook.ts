import { useApi } from "@/api/axios/axiosSetup";
import { addProject, getAllProject, getLatestProject, getProject, updateProjectState } from "@/api/projectAPI";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Project, ProjectInput, ProjectWithKey, UpdateProjectStateInput } from './../@types/project.t';


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

export const useUpdateProjectState = (id:string|number) => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();
    return useMutation<Project, Error, UpdateProjectStateInput>({
        mutationFn: async (projectData:UpdateProjectStateInput) => {
            return await updateProjectState(apiWithAuth, projectData, id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"]});
            queryClient.invalidateQueries({queryKey: ["project"]});
        }
    })
}

export const useGetProjects = () => {
    const { apiWithAuth } = useApi();
    return useQuery<Project[]>({
        queryKey: ["projects"],
        queryFn: () => getAllProject(apiWithAuth),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    })
}


export const useGetLatestProjects = () => {
    const { apiWithAuth } = useApi();
    return useQuery<Project[]>({
        queryKey: ["projects"],
        queryFn: () => getLatestProject(apiWithAuth),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    })
}


export const useGetProject = (id:string|number) => {
    const { apiWithAuth } = useApi();
    return useQuery<Project>({
        queryKey: ["project", id],
        queryFn: () => getProject(apiWithAuth, id),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!id,
        retry: 1,
    })
}