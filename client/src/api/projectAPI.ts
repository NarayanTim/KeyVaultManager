import type { ProjectInput, ProjectWithKey, Project } from "@/@types/project.t";
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
    const response = await apiWithAuth<{ project: Project[] }>({
        url: endpoint,
        method: "GET",
    });
    
    return response.project ?? []
}

