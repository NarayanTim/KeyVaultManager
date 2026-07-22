import { useApi } from "@/api/axios/axiosSetup";
import { addProject, deleteProject, getAllProject, getLatestProject, getProject, updateProjectState } from "@/api/projectAPI";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Project, ProjectDelete, ProjectInput, ProjectWithKey, UpdateProjectStateInput, UpdateProjectStateVariables } from './../@types/project.t';

type InputID = string;


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

export const useUpdateProjectState = () => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();
    return useMutation<UpdateProjectStateInput, Error, UpdateProjectStateVariables>({
        mutationFn: async ({id, projectData}) => {
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
        staleTime: 1000 * 60 * 5,
        retry: 1,
    })
}



export const useGetProject = (id:InputID) => {
    const { apiWithAuth } = useApi();
    return useQuery<Project>({
        queryKey: ["project", id],
        queryFn: () => getProject(apiWithAuth, id),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!id,
        retry: 1,
    })
}

export const useDeleteProject = () => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();
    return useMutation<ProjectDelete, Error, InputID>({
        mutationFn: async(id: InputID) => {
            return await deleteProject(apiWithAuth, id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project"] });
        },
        retry: 1,
    })
}