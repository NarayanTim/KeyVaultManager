import type { ProjectInput, ProjectWithKey, Project, UpdateProjectStats, UpdateProjectStateInput, ProjectDelete } from "@/@types/project.t";

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

export const getProject = async (apiWithAuth: ApiWithAuth, id: string | number): Promise<Project> => {
    console.log("Test Test")
    const endpoint = `/project/get/${id}`
    const response = await apiWithAuth<{project:Project}>({
        url: endpoint,
        method: "GET"
    })
    console.log(response.project, " Did it work")
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


export const updateProjectState = async (apiWithAuth: ApiWithAuth, projectInputProps:UpdateProjectStateInput, id:string|number): Promise<UpdateProjectStats> => {
    const endpoint = `/project/update/${id}`
    const response = await apiWithAuth<{ project: UpdateProjectStats }>({
        url: endpoint,
        method: "PATCH",
        data:projectInputProps,
    })
    return response.project
}


export const deleteProject = async (apiWithAuth: ApiWithAuth, id: string | number):Promise<ProjectDelete>=> {
    const endpoint = `/project//delete/${id}`
    const response = await apiWithAuth<{ name: ProjectDelete }>({
        url: endpoint,
        method: "DELETE",
    })
    return response.name
}