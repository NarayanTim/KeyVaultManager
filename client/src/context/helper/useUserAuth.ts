import { createContext, useContext } from "react";
import type { User_T } from "@/@types/user.t";


export interface UserContextType {
    user: User_T | null;
    isLoading: boolean;
    isSignedIn: boolean;
    refetch?: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserAuth = () => {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return ctx;
};