import type { EnvVariableInput, Secrets } from "@/@types/EnvironmentVariables.t";
import {  type ApiWithAuth } from "./axios/axiosSetup";


type SaveSecretPayloadItem = EnvVariableInput;



// const toSavePayload = (variable: EnvVariableInput): SaveSecretPayloadItem => {
//     const item: SaveSecretPayloadItem = {
//         key: variable.key,
//         value: variable.value,
//         isActive: variable.isActive ?? true,
//     };
//     if (variable.id) {
//         item.id = variable.id;
//     }
//     if (variable.value !== undefined) {
//         item.value = variable.value;
//     }
//     return item;
// }

const toSavePayload = (variable: EnvVariableInput): SaveSecretPayloadItem => ({
    id: variable.id,
    key: variable.key,
    value: variable.value,
    isActive: variable.isActive ?? true,
});



const toSavePayloads = (variables: EnvVariableInput[]): SaveSecretPayloadItem[] => {
    return variables.map(toSavePayload);
}


export const getAllKey = async (apiWithAuth:ApiWithAuth, id:string):Promise<Secrets[]> => {
    const endpoint: string = `key/project/allKeys/${id}`
    const response = await apiWithAuth<{ keys: Secrets[] }>({
        url: endpoint,
        method: "GET",
    });
    return response.keys
}

export const saveAllChangeCall = async (apiWithAuth:ApiWithAuth, id:string, inputData:EnvVariableInput[]):Promise<Secrets[]> => {
    const endpoint: string = `key/project/allKeys/${id}`
    const response = await apiWithAuth<{ keys: Secrets[] }>({
        url: endpoint,
        method: "PUT",
        data:toSavePayloads(inputData),
    });
    return response.keys
}

export const getKeyValue = async (apiWithAuth: ApiWithAuth, id: string) => {
    const endpoint: string = `key/project/allKeys/${id}`
    const response = await apiWithAuth<{ keys: Secrets[] }>({
        url: endpoint,
        method: "GET",
    });
    return response.keys
}