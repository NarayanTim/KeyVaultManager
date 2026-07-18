export interface Project {
    id: string;
    userId: string;
    name: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProjectWithKey extends Partial<Project> {
    key?: string;
}

export interface ProjectInput{
    name: string;
    isActive: boolean;
}