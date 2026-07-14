import { type ReactNode } from "react";
import { useUserProfile } from "@/hooks/authHook";
import { UserContext } from "./helper/useAuth";


export const UserProvider = ({children}: {children: ReactNode}) => { 
    const { data: user, isLoading, refetch } = useUserProfile()
    console.log(user + " User")
    return (
        <UserContext.Provider
            value={{
                user: user ?? null,
                isLoading,
                refetch
            }}
        >
            {children}
        </UserContext.Provider>
    )
}