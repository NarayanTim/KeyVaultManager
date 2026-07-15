import { type ReactNode } from "react";
import { useUserProfile } from "@/hooks/authHook";
import { UserContext } from "./helper/useUserAuth";


export const UserProvider = ({ children }: { children: ReactNode }) => { 
    const { data: user, isLoading, refetch, isSignedIn } = useUserProfile()
    return (
        <UserContext.Provider value={{ user: user ?? null, isLoading, refetch, isSignedIn }}>
            {children}
        </UserContext.Provider>
    )
}