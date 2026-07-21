import type { ProjectInput, ProjectWithKey, Project, UpdateProjectStats, UpdateProjectStateInput } from "@/@types/project.t";
import { type ApiWithAuth } from "./axios/axiosSetup";

export const addProject = async (apiWithAuth:ApiWithAuth, projectInput:ProjectInput):Promise<ProjectWithKey> => {
    const endpoint = '/project/add-project'
    const response = await apiWithAuth<{ project: ProjectWithKey }>({
        url: endpoint,
        method: "POST",
        data:projectInput,
    });

    return response.project

}

export const getAllProject = async (apiWithAuth:ApiWithAuth):Promise<Project[]> => {
    const endpoint = '/project/all'
    const response = await apiWithAuth<{ projects: Project[] }>({
        url: endpoint,
        method: "GET",
    });

    return response.projects ?? []
}

export const getProject = async (apiWithAuth:ApiWithAuth, id:string|number): Promise<Project> => {
    const endpoint = `/project/get/${id}`
    const response = await apiWithAuth<{project:Project}>({
        url: endpoint,
        method: "GET"
    })
    return response.project
}


export const getLatestProject = async (apiWithAuth:ApiWithAuth): Promise<Project[]> => {
    const endpoint = `/project/latest`
    const response = await apiWithAuth<{projects:Project[]}>({
        url: endpoint,
        method: "GET"
    })
    return response.projects
}



export const updateProjectState = async (apiWithAuth: ApiWithAuth, projectInput:UpdateProjectStateInput, id:string|number): Promise<UpdateProjectStats> => {
    const endpoint = `/project/update/${id}`
    const response = await apiWithAuth<{ project: UpdateProjectStats }>({
        url: endpoint,
        method: "PATCH",
        data:ProjectInput,
    })
    return response.project
}