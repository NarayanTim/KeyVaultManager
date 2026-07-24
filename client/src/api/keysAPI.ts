import type { EnvVariableInput, Secrets } from "@/@types/EnvironmentVariables.t";
import {  type ApiWithAuth } from "./axios/axiosSetup";


type newType = Pick<Secrets, 'key' | 'value' | 'isActive'>[]




const envVariablesToSecretPayloads = (variables: EnvVariableInput[]): newType =>  {
  return variables.map(envVariableToSecretPayload);
}


export const getAllKey = async (apiWithAuth:ApiWithAuth, id:string):Promise<Secrets> => {
    const endpoint: string = `key/project/allKeys/${id}`
    const response = await apiWithAuth<{ keys: Secrets }>({
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
        data: JSON.stringify(envVariablesToSecretPayloads(inputData)),
    });
    return response.keys
}