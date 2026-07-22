export interface Project {
    id: string;
    userId: string;
    name: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProjectWithKey extends Partial<Project> {
    key: string;
}

export interface ProjectInput{
    name: string;
    isActive: boolean;
}

export type UpdateProjectStateInput = Pick<Project, "isActive">

export type UpdateProjectStateVariables = {
    id: string;
    projectData: UpdateProjectStateInput;
};


export type UpdateProjectStats = Pick<Project, "name" | "isActive">;
export type ProjectDelete = Pick<Project, "name">;